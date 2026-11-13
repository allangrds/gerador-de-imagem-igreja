// Text on canvas the way CSS lays it out, using only what every browser supports
// (no ctx.letterSpacing, which Safari got late).

// Like CSS letter-spacing: the space also follows the last letter.
export function measureSpaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  spacing = 0
) {
  return ctx.measureText(text).width + [...text].length * spacing
}

// Each letter goes where it would be without spacing (kerning kept), pushed by the spacing so far.
export function fillSpaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing = 0
) {
  if (!spacing) {
    ctx.fillText(text, x, y)
    return
  }

  const chars = [...text]

  chars.forEach((char, index) => {
    const before = chars.slice(0, index).join('')
    ctx.fillText(char, x + ctx.measureText(before).width + index * spacing, y)
  })
}

function splitLongWord(
  ctx: CanvasRenderingContext2D,
  word: string,
  maxWidth: number,
  spacing: number
) {
  const pieces: string[] = []
  let piece = ''

  for (const char of word) {
    if (piece && measureSpaced(ctx, piece + char, spacing) > maxWidth) {
      pieces.push(piece)
      piece = char
    } else {
      piece += char
    }
  }

  return piece ? [...pieces, piece] : pieces
}

// Wraps on spaces and breaks words that don't fit (overflow-wrap: anywhere).
export function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  spacing = 0
) {
  const words = text
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((word) => splitLongWord(ctx, word, maxWidth, spacing))
  const lines: string[] = []

  for (const word of words) {
    const current = lines[lines.length - 1]
    const candidate = current ? `${current} ${word}` : word

    if (current && measureSpaced(ctx, candidate, spacing) <= maxWidth) {
      lines[lines.length - 1] = candidate
    } else {
      lines.push(word)
    }
  }

  return lines
}

// One line ending in "…" (text-overflow: ellipsis).
export function ellipsize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  if (ctx.measureText(text).width <= maxWidth) {
    return text
  }

  let end = text.length

  while (
    end > 0 &&
    ctx.measureText(`${text.slice(0, end)}…`).width > maxWidth
  ) {
    end -= 1
  }

  return `${text.slice(0, end).trimEnd()}…`
}

// Places the baseline the way CSS does: glyphs centered in the line box (half-leading).
export function baselineFor(
  ctx: CanvasRenderingContext2D,
  lineTop: number,
  lineHeight: number
) {
  const metrics = ctx.measureText('Hg')
  const ascent = metrics.fontBoundingBoxAscent
  const descent = metrics.fontBoundingBoxDescent

  return lineTop + (lineHeight - (ascent + descent)) / 2 + ascent
}
