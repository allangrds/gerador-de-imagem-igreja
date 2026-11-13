import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { BulletinEditor } from './Editor'
import { renderBulletinPdf } from './exportPdf'

vi.mock('./exportPdf', () => ({
  renderBulletinPdf: vi.fn().mockResolvedValue(new Blob(['%PDF'])),
}))

function renderEditor() {
  return render(
    <MemoryRouter>
      <BulletinEditor />
    </MemoryRouter>
  )
}

function pageNames() {
  const list = screen.getByRole('list', { name: 'Páginas do boletim' })

  return within(list)
    .getAllByRole('button', { name: /^Editar página/ })
    .map((button) => button.getAttribute('aria-label'))
}

beforeAll(() => {
  URL.createObjectURL = vi.fn(() => 'blob:boletim')
  URL.revokeObjectURL = vi.fn()
})

describe('BulletinEditor', () => {
  it('starts with the cover and the closing page', () => {
    renderEditor()

    expect(pageNames()).toEqual([
      'Editar página 1: Capa',
      'Editar página 2: Página final',
    ])
  })

  it('adds the chosen model at the end and opens it for editing', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByRole('button', { name: /^Comunicado/ }))
    await user.click(
      screen.getByRole('button', { name: 'Adicionar “Comunicado”' })
    )

    expect(pageNames()[2]).toBe('Editar página 3: Comunicado')
    expect(
      screen.getByRole('heading', { name: 'Comunicado', level: 2 })
    ).toBeInTheDocument()
  })

  it('moves and removes pages', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByRole('button', { name: 'Subir página 2' }))
    expect(pageNames()).toEqual([
      'Editar página 1: Página final',
      'Editar página 2: Capa',
    ])

    await user.click(screen.getByRole('button', { name: 'Remover página 1' }))
    expect(pageNames()).toEqual(['Editar página 1: Capa'])
  })

  it('updates the preview while typing', async () => {
    const user = userEvent.setup()
    renderEditor()

    const title = screen.getByLabelText('Título')
    await user.clear(title)
    await user.type(title, 'Boletim de dezembro')

    expect(screen.getAllByText('Boletim de dezembro').length).toBeGreaterThan(0)
  })

  it('keeps the cover saved on this device but not the other models', async () => {
    const user = userEvent.setup()
    const { unmount } = renderEditor()

    const title = screen.getByLabelText('Título')
    await user.clear(title)
    await user.type(title, 'Boletim de dezembro')

    await user.click(screen.getByRole('button', { name: /^Comunicado/ }))
    await user.click(
      screen.getByRole('button', { name: 'Adicionar “Comunicado”' })
    )
    const notice = screen.getByLabelText('Título')
    await user.clear(notice)
    await user.type(notice, 'Aviso temporário')
    unmount()

    renderEditor()
    expect(screen.getByLabelText('Título')).toHaveValue('Boletim de dezembro')

    await user.click(screen.getByRole('button', { name: /^Comunicado/ }))
    await user.click(
      screen.getByRole('button', { name: 'Adicionar “Comunicado”' })
    )
    expect(screen.getByLabelText('Título')).not.toHaveValue('Aviso temporário')
  })

  it('downloads the PDF with the pages in order', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByRole('button', { name: /Baixar PDF/ }))

    expect(renderBulletinPdf).toHaveBeenCalledWith([
      expect.objectContaining({ type: 'cover' }),
      expect.objectContaining({ type: 'closing' }),
    ])
    expect(await screen.findByText('PDF baixado')).toBeInTheDocument()
  })
})
