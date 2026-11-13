import { fitWithin } from './image'

describe('fitWithin', () => {
  it('keeps images that already fit', () => {
    expect(fitWithin(1200, 800, 1600)).toEqual({ width: 1200, height: 800 })
  })

  it('shrinks the longest side to the limit keeping the proportion', () => {
    expect(fitWithin(4000, 3000, 1600)).toEqual({ width: 1600, height: 1200 })
    expect(fitWithin(1080, 2400, 1600)).toEqual({ width: 720, height: 1600 })
  })
})
