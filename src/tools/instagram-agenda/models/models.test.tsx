import { render, screen } from '@testing-library/react'
import { closing } from './Closing'
import { cover } from './Cover'
import { dates } from './Dates'

// The art is drawn on a canvas; its text is read from the image's label.
describe('cover', () => {
  it('describes the church, title and subtitle', () => {
    render(
      <cover.Preview
        data={{ title: 'Agenda', subtitle: 'Novembro', image: null }}
      />
    )

    expect(
      screen.getByRole('img', {
        name: 'Igreja Adventista do Belém SP. Agenda. Novembro',
      })
    ).toBeInTheDocument()
  })
})

describe('dates', () => {
  it('describes the title and each event, by date', () => {
    render(<dates.Preview data={dates.sample!()} />)

    const image = screen.getByRole('img', { name: /^Agenda\. Novembro\./ })
    const label = image.getAttribute('aria-label')!

    expect(label).toContain('14 NOV, Sábado jovem, Sábado · 17h')
    expect(label.indexOf('Sábado jovem')).toBeLessThan(
      label.indexOf('Culto de oração')
    )
  })
})

describe('closing', () => {
  it('shows only the logo and the save and share invitations', () => {
    render(<closing.Preview data={closing.defaults()} />)

    expect(
      screen.getByRole('img', {
        name: 'Igreja Adventista do Sétimo Dia – Belém. Salve a agenda. Envie para um amigo',
      })
    ).toBeInTheDocument()
  })
})
