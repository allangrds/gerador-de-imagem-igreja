import { slugify } from './slugify'

describe('slugify', () => {
  it('removes accents and punctuation', () => {
    expect(slugify('Compaixão pelos imperdoáveis!')).toBe(
      'compaixao-pelos-imperdoaveis'
    )
  })

  it('returns an empty string when there is nothing to keep', () => {
    expect(slugify('  —  ')).toBe('')
  })
})
