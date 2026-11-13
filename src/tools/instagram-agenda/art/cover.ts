import { CHURCH_NAME } from '../../../lib/church'
import {
  baselineFor,
  fillSpaced,
  measureSpaced,
  wrapLines,
} from '../../../lib/canvasText'
import { titleSize } from '../../../lib/format'
import type { AgendaCoverData } from '../types'
import {
  ART_HEIGHT,
  ART_WIDTH,
  COLORS,
  LINE_HEIGHT,
  artFont,
  defineArt,
  drawIcon,
  fillBackground,
  upper,
  w,
} from './canvas'

const SIDE = w(8)
const KICKER = { size: w(3), spacing: 0.22 }
const TITLE = { lineHeight: 0.95, bottom: w(30), gap: w(3.5) }
const BAND = {
  size: w(4.4),
  spacing: 0.12,
  bottom: w(12),
  padding: { top: w(2.8), right: w(6), left: w(8) },
}
const SWIPE = {
  size: w(3),
  spacing: 0.16,
  bottom: w(13.4),
  icon: w(4.4),
  gap: w(1.6),
}
const ARROW = ['M5 12h14', 'M13 6l6 6-6 6']

// object-fit: cover, centered.
function drawPhoto(ctx: CanvasRenderingContext2D, photo: HTMLImageElement) {
  const scale = Math.max(
    ART_WIDTH / photo.naturalWidth,
    ART_HEIGHT / photo.naturalHeight
  )
  const width = photo.naturalWidth * scale
  const height = photo.naturalHeight * scale

  ctx.drawImage(
    photo,
    (ART_WIDTH - width) / 2,
    (ART_HEIGHT - height) / 2,
    width,
    height
  )
}

// Darkens the bottom so the title reads on any photo.
function drawShade(ctx: CanvasRenderingContext2D) {
  const shade = ctx.createLinearGradient(0, 0, 0, ART_HEIGHT)
  shade.addColorStop(0, 'rgba(20, 18, 16, 0.2)')
  shade.addColorStop(0.35, 'rgba(20, 18, 16, 0.25)')
  shade.addColorStop(0.78, 'rgba(20, 18, 16, 0.92)')
  shade.addColorStop(1, COLORS.ink)
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, ART_WIDTH, ART_HEIGHT)
}

// Church name over the title, growing upwards from a fixed bottom.
function drawHeading(ctx: CanvasRenderingContext2D, title: string) {
  const titleFont = w(titleSize(title, 17))
  const titleLineHeight = titleFont * TITLE.lineHeight
  const kickerLineHeight = KICKER.size * LINE_HEIGHT

  ctx.font = artFont(700, titleFont)
  const lines = wrapLines(ctx, upper(title), ART_WIDTH - SIDE * 2)
  const titleTop = ART_HEIGHT - TITLE.bottom - lines.length * titleLineHeight
  const kickerTop = titleTop - TITLE.gap - kickerLineHeight

  ctx.fillStyle = COLORS.paper
  lines.forEach((line, index) => {
    const top = titleTop + index * titleLineHeight
    ctx.fillText(line, SIDE, baselineFor(ctx, top, titleLineHeight))
  })

  ctx.font = artFont(400, KICKER.size)
  ctx.fillStyle = COLORS.gold
  fillSpaced(
    ctx,
    upper(CHURCH_NAME),
    SIDE,
    baselineFor(ctx, kickerTop, kickerLineHeight),
    KICKER.size * KICKER.spacing
  )
}

// The golden band from the left edge, sized to its text.
function drawBand(ctx: CanvasRenderingContext2D, subtitle: string) {
  const { padding } = BAND
  const spacing = BAND.size * BAND.spacing
  const lineHeight = BAND.size * LINE_HEIGHT

  ctx.font = artFont(700, BAND.size)
  const lines = wrapLines(
    ctx,
    upper(subtitle),
    ART_WIDTH - padding.left - padding.right,
    spacing
  )
  const textWidth = Math.max(
    ...lines.map((line) => measureSpaced(ctx, line, spacing))
  )
  const height = padding.top * 2 + lines.length * lineHeight
  const top = ART_HEIGHT - BAND.bottom - height

  ctx.fillStyle = COLORS.gold
  ctx.fillRect(0, top, padding.left + textWidth + padding.right, height)

  ctx.fillStyle = COLORS.ink
  lines.forEach((line, index) => {
    const lineTop = top + padding.top + index * lineHeight
    fillSpaced(
      ctx,
      line,
      padding.left,
      baselineFor(ctx, lineTop, lineHeight),
      spacing
    )
  })
}

function drawSwipe(ctx: CanvasRenderingContext2D) {
  const spacing = SWIPE.size * SWIPE.spacing
  const lineHeight = SWIPE.size * LINE_HEIGHT
  const height = Math.max(lineHeight, SWIPE.icon)
  const top = ART_HEIGHT - SWIPE.bottom - height
  const iconLeft = ART_WIDTH - SIDE - SWIPE.icon
  const text = upper('Arraste')

  ctx.font = artFont(400, SWIPE.size)
  ctx.fillStyle = COLORS.swipe
  fillSpaced(
    ctx,
    text,
    iconLeft - SWIPE.gap - measureSpaced(ctx, text, spacing),
    baselineFor(ctx, top + (height - lineHeight) / 2, lineHeight),
    spacing
  )
  drawIcon(
    ctx,
    ARROW,
    iconLeft,
    top + (height - SWIPE.icon) / 2,
    SWIPE.icon,
    COLORS.swipe
  )
}

export const coverArt = defineArt<AgendaCoverData>({
  images: (data) => [data.image?.src],
  draw(ctx, data, [photo]) {
    fillBackground(ctx, COLORS.ink)

    if (photo) {
      drawPhoto(ctx, photo)
    }

    drawShade(ctx)
    drawHeading(ctx, data.title)

    if (data.subtitle.trim()) {
      drawBand(ctx, data.subtitle)
    }

    drawSwipe(ctx)
  },
  label: (data) =>
    [CHURCH_NAME, data.title, data.subtitle]
      .filter((part) => part.trim())
      .join('. '),
})
