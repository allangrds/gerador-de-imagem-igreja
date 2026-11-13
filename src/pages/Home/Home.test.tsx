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
    expect(screen.getAllByText('Em breve')).toHaveLength(1)
    expect(screen.getByText('2 disponíveis · 1 em breve')).toBeInTheDocument()
    expect(
      screen.getByText('Duas prontas para usar hoje, outras a caminho.')
    ).toBeInTheDocument()
  })
})
