import { buildFileName } from './exportImage'

describe('buildFileName', () => {
  it('names the file after the message title', () => {
    expect(buildFileName('Compaixão pelos imperdoáveis')).toBe(
      'compaixao-pelos-imperdoaveis.jpg'
    )
  })

  it('falls back to a generic name', () => {
    expect(buildFileName('')).toBe('thumbnail.jpg')
  })
})
