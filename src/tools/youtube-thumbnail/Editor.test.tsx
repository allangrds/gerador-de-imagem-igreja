import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { ThumbnailEditor } from './Editor'
import { countTitleLines } from './exportImage'
import { PHOTO_URL_ERROR } from './useThumbnailForm'

vi.mock('./exportImage', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./exportImage')>()),
  countTitleLines: vi.fn().mockResolvedValue(0),
}))

function renderEditor() {
  return render(
    <MemoryRouter>
      <ThumbnailEditor />
    </MemoryRouter>
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.mocked(countTitleLines).mockResolvedValue(0)
})

describe('ThumbnailEditor', () => {
  it('updates the art while typing', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.type(
      screen.getByLabelText('Título da mensagem'),
      'Defendendo os indefensáveis'
    )
    await user.type(screen.getByLabelText('Nome do pregador'), 'Pr. Mark')

    expect(
      screen.getAllByText('Defendendo os indefensáveis').length
    ).toBeGreaterThan(0)
    expect(screen.getAllByText('Pr. Mark').length).toBeGreaterThan(0)
  })

  it('only enables the download once title and preacher are filled', async () => {
    const user = userEvent.setup()
    renderEditor()
    const download = screen.getByRole('button', { name: /Baixar JPG/ })

    expect(download).toBeDisabled()

    await user.type(screen.getByLabelText('Título da mensagem'), 'Graça')
    expect(download).toBeDisabled()

    await user.type(screen.getByLabelText('Nome do pregador'), 'Pr. Ana')
    expect(download).toBeEnabled()
  })

  it('restores the fields saved on this device', async () => {
    const user = userEvent.setup()
    const { unmount } = renderEditor()

    await user.type(screen.getByLabelText('Título da mensagem'), 'Graça')
    unmount()
    renderEditor()

    expect(screen.getByLabelText('Título da mensagem')).toHaveValue('Graça')
  })

  it('clears every field', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.type(screen.getByLabelText('Título da mensagem'), 'Graça')
    await user.click(screen.getByRole('button', { name: 'Limpar campos' }))

    expect(screen.getByLabelText('Título da mensagem')).toHaveValue('')
  })

  it('warns when the title takes more than two lines', async () => {
    vi.mocked(countTitleLines).mockResolvedValue(3)

    renderEditor()

    expect(
      await screen.findByText(/O título ocupa 3 linhas/)
    ).toBeInTheDocument()
  })

  it('explains what to do when the photo link cannot be loaded', async () => {
    vi.stubGlobal(
      'Image',
      class {
        onerror: (() => void) | null = null
        crossOrigin = ''
        set src(_value: string) {
          setTimeout(() => this.onerror?.())
        }
      }
    )
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByRole('radio', { name: 'Colar link' }))
    await user.type(
      screen.getByLabelText('Link da imagem'),
      'https://example.com/pagina'
    )
    await user.click(screen.getByRole('button', { name: 'Carregar imagem' }))

    expect(await screen.findByText(PHOTO_URL_ERROR)).toBeInTheDocument()
    expect(screen.getByLabelText('Link da imagem')).toHaveAttribute(
      'aria-invalid',
      'true'
    )
  })
})
