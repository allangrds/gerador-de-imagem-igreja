import {
  dayAndMonth,
  joinParts,
  longDate,
  monthAndYear,
  sortByDate,
  titleSize,
  weekday,
} from './format'

describe('dates', () => {
  it('writes the full date in Portuguese', () => {
    expect(longDate('2026-11-21')).toBe('Sábado, 21 de novembro')
    expect(longDate('2026-12-02')).toBe('Quarta-feira, 2 de dezembro')
  })

  it('splits the day and the short month for the calendar', () => {
    expect(dayAndMonth('2026-12-06')).toEqual({ day: '06', month: 'DEZ' })
  })

  it('names the weekday', () => {
    expect(weekday('2026-12-06')).toBe('Domingo')
  })

  it('names the month and year for the cover', () => {
    expect(monthAndYear(new Date(2026, 10, 13))).toBe('Novembro · 2026')
  })

  it('returns nothing for an empty date', () => {
    expect(longDate('')).toBe('')
    expect(weekday('')).toBe('')
    expect(dayAndMonth('')).toEqual({ day: '', month: '' })
  })
})

describe('joinParts', () => {
  it('skips empty parts', () => {
    expect(joinParts(['Sábado', '', '9h'])).toBe('Sábado · 9h')
  })
})

describe('sortByDate', () => {
  it('orders by date and leaves undated items at the end', () => {
    const items = [
      { date: '2026-12-06', name: 'b' },
      { date: '', name: 'c' },
      { date: '2026-11-21', name: 'a' },
    ]

    expect(sortByDate(items).map((item) => item.name)).toEqual(['a', 'b', 'c'])
  })
})

describe('titleSize', () => {
  it('keeps the size when every word fits the line', () => {
    expect(titleSize('Próximos eventos', 11)).toBe(11)
  })

  it('shrinks the size until the longest word fits the line', () => {
    expect(titleSize('Boletim informativo', 14)).toBeCloseTo(
      84 / (11 * 0.82),
      2
    )
  })
})
