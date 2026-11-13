import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Home } from './Home'

describe('Home', () => {
  it('links the available tool to its editor and marks the others as coming soon', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: /Thumbnail para YouTube/ })
    ).toHaveAttribute('href', '/thumbnail-youtube')
    expect(screen.getAllByText('Em breve')).toHaveLength(2)
  })
})
