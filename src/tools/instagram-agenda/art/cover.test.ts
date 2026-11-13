import { fakeContext, findRun, fontSizeOf } from '../../../test/fakeCanvas'
import { ART_HEIGHT, ART_WIDTH, COLORS } from './canvas'
import { coverArt } from './cover'

const data = { title: 'Agenda', subtitle: 'Novembro', image: null }

function draw(overrides = {}, images: (HTMLImageElement | null)[] = [null]) {
  const fake = fakeContext()
  coverArt.draw(fake.ctx, { ...data, ...overrides }, images)

  return fake
}

function band(calls: ReturnType<typeof draw>['calls']) {
  const call = calls.find(
    (item) => item.method === 'fillRect' && item.fillStyle === COLORS.gold
  )

  return call && (call.args as number[])
}

describe('coverArt', () => {
  it('ends the golden band 12% of the width above the bottom, from the left edge', () => {
    const { calls } = draw()
    const [x, y, , height] = band(calls)!

    expect(x).toBe(0)
    expect(y + height).toBeCloseTo(ART_HEIGHT - 129.6)
  })

  it('writes the month inside the band', () => {
    const { calls } = draw()
    const [, y, width, height] = band(calls)!
    const month = findRun(calls, 'NOVEMBRO')

    expect(month.x).toBeCloseTo(86.4)
    expect(month.end).toBeLessThan(width)
    expect(month.y).toBeGreaterThan(y)
    expect(month.y).toBeLessThan(y + height)
    expect(month.fillStyle).toBe(COLORS.ink)
  })

  it('keeps the church name and the title above the band', () => {
    const { calls } = draw()
    const [, bandTop] = band(calls)!
    const kicker = findRun(calls, 'IGREJA ADVENTISTA DO BELÉM SP')
    const title = findRun(calls, 'AGENDA')

    expect(fontSizeOf(title.font)).toBeCloseTo(183.6)
    expect(kicker.y).toBeLessThan(title.y - fontSizeOf(title.font) * 0.8)
    expect(title.y).toBeLessThan(ART_HEIGHT - 324)
    expect(title.y).toBeLessThan(bandTop)
  })

  it('stacks a long title upwards, so it never reaches the band', () => {
    const { calls } = draw({ title: 'Agenda de dezembro e janeiro' })
    const [, bandTop] = band(calls)!
    const lines = ['AGENDA DE', 'DEZEMBRO E', 'JANEIRO'].map((line) =>
      findRun(calls, line)
    )

    expect(lines[0].y).toBeLessThan(lines[1].y)
    expect(lines[1].y).toBeLessThan(lines[2].y)
    expect(lines[2].y).toBeLessThan(bandTop)
  })

  it('invites to swipe at the right', () => {
    const { calls } = draw()
    const swipe = findRun(calls, 'ARRASTE')

    expect(swipe.end).toBeLessThan(ART_WIDTH - 86.4)
    expect(calls.some((call) => call.method === 'stroke')).toBe(true)
  })

  it('has no band without a subtitle', () => {
    const { calls } = draw({ subtitle: '' })

    expect(band(calls)).toBeUndefined()
  })

  it('covers the whole image with the photo, cropping the sides', () => {
    const photo = { naturalWidth: 1000, naturalHeight: 500 } as HTMLImageElement
    const { calls } = draw({}, [photo])
    const image = calls.find((call) => call.method === 'drawImage')!

    expect(image.args).toEqual([photo, -810, 0, 2700, 1350])
  })
})
