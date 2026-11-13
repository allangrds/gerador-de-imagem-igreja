import { render, screen } from '@testing-library/react'
import { closing } from './Closing'

describe('closing', () => {
  it('shows only the logo and the save and share invitations', () => {
    render(<closing.Preview data={closing.defaults()} />)

    expect(
      screen.getByRole('img', {
        name: 'Igreja Adventista do Sétimo Dia – Belém',
      })
    ).toBeInTheDocument()
    expect(screen.getByText('Salve a agenda')).toBeInTheDocument()
    expect(screen.getByText('Envie para um amigo')).toBeInTheDocument()
    expect(screen.queryByText('Te esperamos!')).not.toBeInTheDocument()
    expect(screen.queryByText(/Rua Martim Affonso/)).not.toBeInTheDocument()
  })
})
