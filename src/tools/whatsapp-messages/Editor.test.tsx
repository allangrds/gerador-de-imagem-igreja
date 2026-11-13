import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { WhatsappEditor } from './Editor'

function renderEditor() {
  return render(
    <MemoryRouter>
      <WhatsappEditor />
    </MemoryRouter>
  )
}

function bubble() {
  return screen.getByRole('region', { name: 'Como fica no WhatsApp' })
}

describe('WhatsappEditor', () => {
  it('shows the formatted message while typing', async () => {
    const user = userEvent.setup()
    renderEditor()

    const title = screen.getByLabelText('Título')
    await user.clear(title)
    await user.type(title, 'Culto jovem')

    expect(within(bubble()).getByText('Culto jovem').tagName).toBe('STRONG')
  })

  it('switches between models', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByRole('button', { name: /^Aniversariantes/ }))

    expect(screen.getByLabelText('Período')).toBeInTheDocument()
    expect(
      within(bubble()).getByText('Aniversariantes da semana')
    ).toBeInTheDocument()
  })

  it('copies the plain text with the WhatsApp marks', async () => {
    const user = userEvent.setup()
    renderEditor()
    const writeText = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue()

    await user.click(screen.getByRole('button', { name: 'Copiar mensagem' }))

    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('⛪ *Culto de sábado*')
    )
    expect(await screen.findByText(/Copiada!/)).toBeInTheDocument()
  })

  it('opens WhatsApp with the message ready', () => {
    renderEditor()

    const link = screen.getByRole('link', { name: /Abrir no WhatsApp/ })
    expect(link.getAttribute('href')).toMatch(
      /^https:\/\/wa\.me\/\?text=%E2%9B%AA%20\*Culto%20de%20s%C3%A1bado\*/
    )
  })

  it('turns the emojis off', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByRole('switch', { name: 'Incluir emojis' }))
    await user.click(screen.getByRole('tab', { name: 'Texto puro' }))

    expect(
      within(bubble()).getByText(/^\*Culto de sábado\*/)
    ).toBeInTheDocument()
  })

  it('keeps the fields on this device and restores the model text', async () => {
    const user = userEvent.setup()
    const { unmount } = renderEditor()

    await user.clear(screen.getByLabelText('Pregador'))
    await user.type(screen.getByLabelText('Pregador'), 'Pr. Ana')
    unmount()

    renderEditor()
    expect(screen.getByLabelText('Pregador')).toHaveValue('Pr. Ana')

    await user.click(
      screen.getByRole('button', { name: 'Restaurar texto do modelo' })
    )
    expect(screen.getByLabelText('Pregador')).toHaveValue('Pr. Thiago da Silva')
  })

  it('fills a model of the church line', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(
      screen.getByRole('button', { name: /^Pedido de alimentos para a ASA/ })
    )
    await user.type(screen.getByLabelText('Alimentos'), 'Arroz, 10 kg')

    expect(
      within(bubble()).getByText('Ajude a completar as próximas cestas')
    ).toBeInTheDocument()
    expect(within(bubble()).getByText('- Arroz, 10 kg')).toBeInTheDocument()
  })
})
