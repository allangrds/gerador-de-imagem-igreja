import { render, screen } from '@testing-library/react'
import { closing } from './Closing'
import { cover } from './Cover'

const photo = { src: 'data:image/png;base64,', name: 'foto.png', detail: '' }

describe('cover', () => {
  it('shows the church logo in the middle when there is no photo', () => {
    render(<cover.Preview data={cover.defaults()} />)

    expect(
      screen.getByRole('img', {
        name: 'Igreja Adventista do Sétimo Dia – Belém',
      })
    ).toBeInTheDocument()
  })

  it('leaves the photo free of the logo', () => {
    render(<cover.Preview data={{ ...cover.defaults(), image: photo }} />)

    expect(
      screen.queryByRole('img', {
        name: 'Igreja Adventista do Sétimo Dia – Belém',
      })
    ).not.toBeInTheDocument()
  })

  it('does not write the church name above the title', () => {
    render(<cover.Preview data={cover.defaults()} />)

    expect(
      screen.queryByText('Igreja Adventista do Belém SP')
    ).not.toBeInTheDocument()
  })
})

describe('closing', () => {
  it('links to the church Instagram and YouTube by default', () => {
    expect(closing.defaults()).toMatchObject({
      instagram: 'https://www.instagram.com/adventistas_belemsp/',
      youtube: 'https://www.youtube.com/@iasdbelemsp',
    })
  })

  it('shows only the logo, the social icons and the address', () => {
    const data = closing.defaults()
    render(<closing.Preview data={data} />)

    expect(
      screen.getByRole('img', {
        name: 'Igreja Adventista do Sétimo Dia – Belém',
      })
    ).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Instagram' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'YouTube' })).toBeInTheDocument()
    expect(screen.getByText(/Rua Martim Affonso, 152/)).toBeInTheDocument()
    expect(screen.queryByText('Feliz sábado!')).not.toBeInTheDocument()
  })
})
