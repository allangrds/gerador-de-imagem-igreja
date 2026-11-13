import { datedFileName } from './download'

describe('datedFileName', () => {
  it('appends the day, month and year', () => {
    expect(
      datedFileName('boletim-iasd-belem', 'pdf', new Date(2026, 10, 3))
    ).toBe('boletim-iasd-belem-03-11-2026.pdf')
  })
})
