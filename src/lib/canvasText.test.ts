import { fakeContext, textRuns } from '../test/fakeCanvas'
import {
  baselineFor,
  ellipsize,
  fillSpaced,
  measureSpaced,
  wrapLines,
} from './canvasText'

// In the fake context every character is 6 px wide at 10 px.
function context() {
  const fake = fakeContext()
  fake.ctx.font = '10px sans-serif'

  return fake
}

describe('wrapLines', () => {
  it('breaks on spaces when the line is full', () => {
    const { ctx } = context()

    expect(wrapLines(ctx, 'um dois tres quatro', 60)).toEqual([
      'um dois',
      'tres',
      'quatro',
    ])
  })

  it('breaks words that do not fit on a line of their own', () => {
    const { ctx } = context()

    expect(wrapLines(ctx, 'abcdefghijkl', 30)).toEqual(['abcde', 'fghij', 'kl'])
  })

  it('has no lines for empty text', () => {
    const { ctx } = context()

    expect(wrapLines(ctx, '  ', 60)).toEqual([])
  })

  it('counts the letter spacing when it is given', () => {
    const { ctx } = context()

    expect(wrapLines(ctx, 'ab cd', 30, 2)).toEqual(['ab', 'cd'])
  })
})

describe('measureSpaced', () => {
  it('adds the spacing after every letter, the last one included, like CSS', () => {
    const { ctx } = context()

    expect(measureSpaced(ctx, 'abc', 2)).toBe(24)
  })
})

describe('fillSpaced', () => {
  it('draws one letter at a time, spaced apart', () => {
    const { ctx, calls } = context()

    fillSpaced(ctx, 'abc', 100, 50, 2)

    expect(calls.map((call) => call.args)).toEqual([
      ['a', 100, 50],
      ['b', 108, 50],
      ['c', 116, 50],
    ])
    expect(textRuns(calls)[0].text).toBe('abc')
  })
})

describe('ellipsize', () => {
  it('keeps text that fits', () => {
    const { ctx } = context()

    expect(ellipsize(ctx, 'curto', 60)).toBe('curto')
  })

  it('cuts text that does not fit and ends it with an ellipsis', () => {
    const { ctx } = context()

    expect(ellipsize(ctx, 'um texto comprido', 60)).toBe('um texto…')
  })
})

describe('baselineFor', () => {
  it('centers the glyphs in the line box, like CSS half-leading', () => {
    const { ctx } = context()

    // 10 px font (8 above, 2 below) in a 20 px line: 5 px of leading on each side.
    expect(baselineFor(ctx, 100, 20)).toBe(113)
  })
})
