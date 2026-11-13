// jsdom has no canvas. This context records what is drawn and measures text as
// 0.6 em per character, with 0.8 em above the baseline and 0.2 em below.
export type DrawCall = {
  method: string
  args: unknown[]
  font: string
  fillStyle: unknown
}

export function fontSizeOf(font: string) {
  return Number(/([\d.]+)px/.exec(font)?.[1] ?? 10)
}

// Path2D only keeps the SVG path it was given.
class FakePath2D {
  constructor(readonly d = '') {}
}

export function fakeContext() {
  globalThis.Path2D ??= FakePath2D as unknown as typeof Path2D
  const calls: DrawCall[] = []
  const record =
    (method: string) =>
    (...args: unknown[]) => {
      calls.push({ method, args, font: ctx.font, fillStyle: ctx.fillStyle })
    }
  const ctx = {
    font: '10px sans-serif',
    fillStyle: '#000' as unknown,
    strokeStyle: '#000' as unknown,
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    measureText(text: string) {
      const size = fontSizeOf(ctx.font)

      return {
        width: text.length * size * 0.6,
        fontBoundingBoxAscent: size * 0.8,
        fontBoundingBoxDescent: size * 0.2,
      }
    },
    createLinearGradient: () => ({ addColorStop: () => undefined }),
    fillText: record('fillText'),
    fillRect: record('fillRect'),
    drawImage: record('drawImage'),
    stroke: record('stroke'),
    fill: record('fill'),
    beginPath: record('beginPath'),
    moveTo: record('moveTo'),
    lineTo: record('lineTo'),
    arcTo: record('arcTo'),
    closePath: record('closePath'),
    rect: record('rect'),
    clip: record('clip'),
    save: record('save'),
    restore: record('restore'),
    translate: record('translate'),
    scale: record('scale'),
  }

  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls }
}

export type TextRun = {
  text: string
  x: number
  y: number
  end: number
  font: string
  fillStyle: unknown
}

// The text drawn, glued back together: spaced text is drawn one letter at a time,
// so letters closer than half an em on the same baseline belong to the same run.
export function textRuns(calls: DrawCall[]) {
  const runs: TextRun[] = []

  for (const call of calls) {
    if (call.method !== 'fillText') {
      continue
    }

    const [text, x, y] = call.args as [string, number, number]
    const size = fontSizeOf(call.font)
    const end = x + text.length * size * 0.6
    const last = runs[runs.length - 1]

    if (
      last &&
      last.y === y &&
      last.font === call.font &&
      x >= last.end - 0.01 &&
      x - last.end < size / 2
    ) {
      last.text += text
      last.end = end
    } else {
      runs.push({ text, x, y, end, font: call.font, fillStyle: call.fillStyle })
    }
  }

  return runs
}

export function findRun(calls: DrawCall[], text: string) {
  const run = textRuns(calls).find((item) => item.text === text)

  if (!run) {
    throw new Error(
      `"${text}" was not drawn. Drawn: ${textRuns(calls)
        .map((item) => item.text)
        .join(' | ')}`
    )
  }

  return run
}
