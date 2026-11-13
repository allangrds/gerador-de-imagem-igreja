import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Home } from './Home'

describe('Home', () => {
  it('links the available tools to their editors and marks the others as coming soon', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: /Thumbnail para YouTube/ })
    ).toHaveAttribute('href', '/thumbnail-youtube')
    expect(
      screen.getByRole('link', { name: /Boletim em PDF/ })
    ).toHaveAttribute('href', '/boletim')
    expect(
      screen.getByRole('link', { name: /Agenda para Instagram/ })
    ).toHaveAttribute('href', '/agenda-instagram')
    expect(
      screen.getByRole('link', { name: /Mensagens para WhatsApp/ })
    ).toHaveAttribute('href', '/mensagens-whatsapp')
    expect(screen.getAllByText('Em breve')).toHaveLength(1)
    expect(screen.getByText('4 disponíveis · 1 em breve')).toBeInTheDocument()
    expect(
      screen.getByText('Quatro prontas para usar hoje, outras a caminho.')
    ).toBeInTheDocument()
  })
})
