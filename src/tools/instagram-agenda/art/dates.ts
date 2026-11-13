import type { ListedEvent } from '../../../components/page-builder/EventsField'
import {
  baselineFor,
  ellipsize,
  fillSpaced,
  measureSpaced,
  wrapLines,
} from '../../../lib/canvasText'
import {
  dayAndMonth,
  formatTime,
  joinParts,
  sortByDate,
  titleSize,
  weekday,
} from '../../../lib/format'
import type { DatesData } from '../types'
import {
  ART_WIDTH,
  COLORS,
  LINE_HEIGHT,
  artFont,
  defineArt,
  fillBackground,
  roundedRect,
  upper,
  w,
} from './canvas'

const PADDING = { top: w(9), side: w(8) }
const CONTENT_WIDTH = ART_WIDTH - PADDING.side * 2
const GAP = w(4.5)
const KICKER = { size: w(3), spacing: 0.22, gap: w(1.4) }
const RULE = { width: w(16), height: w(1), bottom: w(2.4), gap: w(4) }
const EVENT = { padding: w(2.8), border: w(0.3), gap: w(4.5) }
const DATE = {
  width: w(13),
  height: w(14),
  radius: w(1.6),
  day: w(5.8),
  month: { size: w(2.5), spacing: 0.16, gap: w(1) },
}
const INFO = {
  left: PADDING.side + DATE.width + EVENT.gap,
  width: CONTENT_WIDTH - DATE.width - EVENT.gap,
  gap: w(0.8),
  name: { size: w(4.8), lineHeight: 1.15 },
  when: { size: w(3.3), spacing: 0.04 },
  description: { size: w(3.3) },
}

function whenOf(event: ListedEvent) {
  return joinParts([weekday(event.date), formatTime(event.hour, event.minute)])
}

// Kicker and title on the left, the golden rule at the right, both on the bottom line.
function drawHeading(ctx: CanvasRenderingContext2D, title: string) {
  const titleFont = w(titleSize(title, 10, 64))
  const kickerLineHeight = KICKER.size * LINE_HEIGHT

  ctx.font = artFont(700, titleFont)
  const lines = wrapLines(
    ctx,
    upper(title),
    CONTENT_WIDTH - RULE.width - RULE.gap
  )
  const textHeight = kickerLineHeight + KICKER.gap + lines.length * titleFont
  const height = Math.max(textHeight, RULE.height + RULE.bottom)
  const bottom = PADDING.top + height
  const textTop = bottom - textHeight
  const titleTop = textTop + kickerLineHeight + KICKER.gap

  ctx.fillStyle = COLORS.ink
  lines.forEach((line, index) => {
    const top = titleTop + index * titleFont
    ctx.fillText(line, PADDING.side, baselineFor(ctx, top, titleFont))
  })

  ctx.font = artFont(400, KICKER.size)
  ctx.fillStyle = COLORS.oliveText
  fillSpaced(
    ctx,
    upper('Agenda'),
    PADDING.side,
    baselineFor(ctx, textTop, kickerLineHeight),
    KICKER.size * KICKER.spacing
  )

  ctx.fillStyle = COLORS.gold
  ctx.fillRect(
    ART_WIDTH - PADDING.side - RULE.width,
    bottom - RULE.bottom - RULE.height,
    RULE.width,
    RULE.height
  )

  return bottom
}

// The black square with the day over the month, centered.
function drawDate(ctx: CanvasRenderingContext2D, date: string, top: number) {
  const { day, month } = dayAndMonth(date)
  const center = PADDING.side + DATE.width / 2
  const monthSpacing = DATE.month.size * DATE.month.spacing
  const stackTop =
    top + (DATE.height - (DATE.day + DATE.month.gap + DATE.month.size)) / 2

  ctx.fillStyle = COLORS.ink
  roundedRect(ctx, PADDING.side, top, DATE.width, DATE.height, DATE.radius)

  ctx.font = artFont(700, DATE.day)
  ctx.fillStyle = COLORS.paper
  ctx.fillText(
    day,
    center - ctx.measureText(day).width / 2,
    baselineFor(ctx, stackTop, DATE.day)
  )

  ctx.font = artFont(400, DATE.month.size)
  ctx.fillStyle = COLORS.gold
  fillSpaced(
    ctx,
    month,
    center - measureSpaced(ctx, month, monthSpacing) / 2,
    baselineFor(ctx, stackTop + DATE.day + DATE.month.gap, DATE.month.size),
    monthSpacing
  )
}

type Block = {
  font: string
  color: string
  lineHeight: number
  lines: string[]
  spacing: number
}

// Name, when and description stacked; empty ones keep their gap, like the flex column.
function infoBlocks(ctx: CanvasRenderingContext2D, event: ListedEvent) {
  const { name, when, description } = INFO
  const blocks: Block[] = []

  ctx.font = artFont(700, name.size)
  blocks.push({
    font: ctx.font,
    color: COLORS.ink,
    lineHeight: name.size * name.lineHeight,
    lines: wrapLines(ctx, upper(event.name), INFO.width),
    spacing: 0,
  })

  const whenSpacing = when.size * when.spacing
  ctx.font = artFont(700, when.size)
  blocks.push({
    font: ctx.font,
    color: COLORS.goldDeep,
    lineHeight: when.size * LINE_HEIGHT,
    lines: wrapLines(ctx, whenOf(event), INFO.width, whenSpacing),
    spacing: whenSpacing,
  })

  if (event.description) {
    ctx.font = artFont(400, description.size)
    blocks.push({
      font: ctx.font,
      color: COLORS.inkSoft,
      lineHeight: description.size * LINE_HEIGHT,
      lines: [ellipsize(ctx, event.description, INFO.width)],
      spacing: 0,
    })
  }

  return blocks
}

function blocksHeight(blocks: Block[]) {
  return (
    blocks.reduce(
      (sum, block) => sum + block.lines.length * block.lineHeight,
      0
    ) +
    (blocks.length - 1) * INFO.gap
  )
}

// One row: rule on top, date square and info centered on each other. Returns its bottom.
function drawEvent(
  ctx: CanvasRenderingContext2D,
  event: ListedEvent,
  top: number
) {
  const blocks = infoBlocks(ctx, event)
  const infoHeight = blocksHeight(blocks)
  const contentTop = top + EVENT.border + EVENT.padding
  const contentHeight = Math.max(DATE.height, infoHeight)

  ctx.fillStyle = COLORS.lineStrong
  ctx.fillRect(PADDING.side, top, CONTENT_WIDTH, EVENT.border)

  drawDate(ctx, event.date, contentTop + (contentHeight - DATE.height) / 2)

  let lineTop = contentTop + (contentHeight - infoHeight) / 2
  for (const block of blocks) {
    ctx.font = block.font
    ctx.fillStyle = block.color
    for (const line of block.lines) {
      fillSpaced(
        ctx,
        line,
        INFO.left,
        baselineFor(ctx, lineTop, block.lineHeight),
        block.spacing
      )
      lineTop += block.lineHeight
    }
    lineTop += INFO.gap
  }

  return contentTop + contentHeight + EVENT.padding
}

function eventLabel(event: ListedEvent) {
  const { day, month } = dayAndMonth(event.date)

  return [
    `${day} ${month}`.trim(),
    event.name,
    whenOf(event),
    event.description,
  ]
    .filter(Boolean)
    .join(', ')
}

export const datesArt = defineArt<DatesData>({
  images: () => [],
  draw(ctx, data) {
    fillBackground(ctx, COLORS.paper)

    let top = drawHeading(ctx, data.title) + GAP
    for (const event of sortByDate(data.events)) {
      top = drawEvent(ctx, event, top)
    }
  },
  label: (data) =>
    ['Agenda', data.title, ...sortByDate(data.events).map(eventLabel)]
      .filter((part) => part.trim())
      .join('. '),
})
