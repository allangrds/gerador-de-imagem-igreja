import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AgendaEditor } from './Editor'
import { renderAgendaZip } from './exportZip'

vi.mock('./exportZip', () => ({
  renderAgendaZip: vi.fn().mockResolvedValue(new Blob(['zip'])),
}))

function renderEditor() {
  return render(
    <MemoryRouter>
      <AgendaEditor />
    </MemoryRouter>
  )
}

function imageNames() {
  const list = screen.getByRole('list', { name: 'Imagens do carrossel' })

  return within(list)
    .getAllByRole('button', { name: /^Editar imagem/ })
    .map((button) => button.getAttribute('aria-label'))
}

beforeAll(() => {
  URL.createObjectURL = vi.fn(() => 'blob:agenda')
  URL.revokeObjectURL = vi.fn()
})

describe('AgendaEditor', () => {
  it('starts with the cover, one dates image and the final image', () => {
    renderEditor()

    expect(imageNames()).toEqual([
      'Editar imagem 1: Capa',
      'Editar imagem 2: Datas',
      'Editar imagem 3: Final',
    ])
  })

  it('adds more dates images', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByRole('button', { name: /^Datas/ }))
    await user.click(screen.getByRole('button', { name: 'Adicionar “Datas”' }))

    expect(imageNames()[3]).toBe('Editar imagem 4: Datas')
  })

  it('updates the art while typing the cover title', async () => {
    const user = userEvent.setup()
    renderEditor()

    const title = screen.getByLabelText('Título')
    await user.clear(title)
    await user.type(title, 'Agenda de dezembro')

    expect(screen.getAllByText('Agenda de dezembro').length).toBeGreaterThan(0)
  })

  it('downloads the .zip with the images in order', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByRole('button', { name: /Baixar \.zip/ }))

    expect(renderAgendaZip).toHaveBeenCalledWith([
      expect.objectContaining({ type: 'cover' }),
      expect.objectContaining({ type: 'dates' }),
      expect.objectContaining({ type: 'closing' }),
    ])
    expect(await screen.findByText('.zip baixado')).toBeInTheDocument()
  })
})
