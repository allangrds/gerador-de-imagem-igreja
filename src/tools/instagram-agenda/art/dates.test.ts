import { fakeContext, findRun, textRuns } from '../../../test/fakeCanvas'
import { ART_HEIGHT } from './canvas'
import { datesArt } from './dates'

const event = { hour: '19', minute: '', description: '' }
const data = {
  title: 'Novembro',
  events: [
    { ...event, date: '2026-11-21', name: 'Retiro de casais' },
    { ...event, date: '2026-11-14', name: 'Sábado jovem', hour: '17' },
    { ...event, date: '2026-11-18', name: 'Culto de oração', minute: '30' },
  ],
}

function draw(overrides = {}) {
  const fake = fakeContext()
  datesArt.draw(fake.ctx, { ...data, ...overrides }, [])

  return fake
}

describe('datesArt', () => {
  it('writes the kicker and the title at the top', () => {
    const { calls } = draw()
    const kicker = findRun(calls, 'AGENDA')
    const title = findRun(calls, 'NOVEMBRO')

    expect(kicker.x).toBeCloseTo(86.4)
    expect(kicker.y).toBeLessThan(title.y)
    expect(title.y).toBeLessThan(300)
  })

  it('lists the events by date, one row each, without overlapping', () => {
    const { calls } = draw()
    const days = ['14', '18', '21'].map((day) => findRun(calls, day))

    expect(days[1].y - days[0].y).toBeGreaterThanOrEqual(151.2)
    expect(days[2].y - days[1].y).toBeGreaterThanOrEqual(151.2)
    expect(findRun(calls, 'SÁBADO JOVEM').y).toBeLessThan(
      findRun(calls, 'CULTO DE ORAÇÃO').y
    )
  })

  it('writes the weekday and time, and the month under the day', () => {
    const { calls } = draw()

    expect(findRun(calls, 'Sábado · 17h')).toBeDefined()
    expect(findRun(calls, 'Quarta-feira · 19h30')).toBeDefined()
    expect(findRun(calls, 'NOV').y).toBeGreaterThan(findRun(calls, '14').y)
  })

  it('cuts a long description on one line with an ellipsis', () => {
    const { calls } = draw({
      events: [
        {
          ...event,
          date: '2026-11-14',
          name: 'Sábado jovem',
          description:
            'Programa especial preparado pelos jovens, com música, testemunhos e um lanche no final.',
        },
      ],
    })
    const description = textRuns(calls).find((run) =>
      run.text.startsWith('Programa')
    )!

    expect(description.text.endsWith('…')).toBe(true)
    expect(description.end).toBeLessThanOrEqual(1080 - 86.4)
  })

  it('fits four events in the image', () => {
    const events = ['2026-11-14', '2026-11-18', '2026-11-21', '2026-11-28'].map(
      (date) => ({ ...event, date, name: 'Culto', description: 'Venha' })
    )
    const { calls } = draw({ events })

    expect(findRun(calls, '28').y).toBeLessThan(ART_HEIGHT)
  })
})
