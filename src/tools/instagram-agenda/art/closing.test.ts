import { fakeContext, findRun } from '../../../test/fakeCanvas'
import { ART_WIDTH } from './canvas'
import { closingArt } from './closing'

function draw(images: (HTMLImageElement | null)[]) {
  const fake = fakeContext()
  closingArt.draw(fake.ctx, { logo: null }, images)

  return fake
}

describe('closingArt', () => {
  it('centers the logo at 40% of the width tall', () => {
    const logo = { naturalWidth: 800, naturalHeight: 400 } as HTMLImageElement
    const { calls } = draw([logo])
    const [, x, , width, height] = calls.find(
      (call) => call.method === 'drawImage'
    )!.args as [unknown, number, number, number, number]

    expect(height).toBeCloseTo(432)
    expect(width).toBeCloseTo(864)
    expect(x).toBeCloseTo((ART_WIDTH - 864) / 2)
  })

  it('shrinks a wide logo to fit the width, keeping its shape', () => {
    const logo = { naturalWidth: 2000, naturalHeight: 400 } as HTMLImageElement
    const { calls } = draw([logo])
    const [, , , width, height] = calls.find(
      (call) => call.method === 'drawImage'
    )!.args as [unknown, number, number, number, number]

    expect(width).toBeCloseTo(907.2)
    expect(height).toBeCloseTo(181.44)
  })

  it('invites to save and share, side by side under the logo', () => {
    const logo = { naturalWidth: 400, naturalHeight: 400 } as HTMLImageElement
    const { calls } = draw([logo])
    const [, , y, , height] = calls.find((call) => call.method === 'drawImage')!
      .args as [unknown, number, number, number, number]
    const save = findRun(calls, 'Salve a agenda')
    const share = findRun(calls, 'Envie para um amigo')

    expect(save.y).toBe(share.y)
    expect(save.y).toBeGreaterThan(y + height)
    expect(share.x).toBeGreaterThan(save.end)
    expect(calls.filter((call) => call.method === 'stroke')).toHaveLength(2)
  })

  it('still draws the invitations when the logo could not load', () => {
    const { calls } = draw([null])

    expect(findRun(calls, 'Salve a agenda')).toBeDefined()
  })
})
