import { slugify } from '../../lib/slugify'
import background from '../../assets/thumbnail-background.png'
import { loadImage } from './photo'

export const EXPORT_WIDTH = 1280
export const EXPORT_HEIGHT = 720

// Same geometry as ThumbnailArt.module.css, in pixels of the 1280×720 art.
const PHOTO_WINDOW = { x: 108, y: 0, width: 1172, height: 559 }
const TEXT_LEFT = 50
const TITLE = {
  font: '700 102.4px GillSans',
  lineHeight: 100,
  bottom: EXPORT_HEIGHT - 120,
  maxChars: 15,
}
const PREACHER = {
  font: '400 48px GillSans',
  lineHeight: 72,
  bottom: EXPORT_HEIGHT - 17,
  maxWidth: EXPORT_WIDTH * 0.54,
}

export type ThumbnailContent = {
  title: string
  preacher: string
  photo?: string | null
  photoPositionY: number
}

export function buildFileName(title: string) {
  return `${slugify(title) || 'thumbnail'}.jpg`
}

// Canvas text only uses web fonts that are already loaded, so load them first.
async function loadFonts() {
  await Promise.all([
    document.fonts.load(TITLE.font),
    document.fonts.load(PREACHER.font),
  ])
}

function createContext() {
  const canvas = document.createElement('canvas')
  canvas.width = EXPORT_WIDTH
  canvas.height = EXPORT_HEIGHT

  return canvas.getContext('2d')
}

function splitLongWord(
  ctx: CanvasRenderingContext2D,
  word: string,
  maxWidth: number
) {
  const pieces: string[] = []
  let piece = ''

  for (const char of word) {
    if (piece && ctx.measureText(piece + char).width > maxWidth) {
      pieces.push(piece)
      piece = char
    } else {
      piece += char
    }
  }

  return piece ? [...pieces, piece] : pieces
}

// Mirrors the CSS: uppercase, `max-width: 15ch`, wrapping on spaces and breaking words that don't fit.
export function wrapTitle(ctx: CanvasRenderingContext2D, title: string) {
  ctx.font = TITLE.font

  const maxWidth = ctx.measureText('0').width * TITLE.maxChars
  const words = title
    .toLocaleUpperCase('pt-BR')
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((word) => splitLongWord(ctx, word, maxWidth))
  const lines: string[] = []

  for (const word of words) {
    const current = lines[lines.length - 1]
    const candidate = current ? `${current} ${word}` : word

    if (current && ctx.measureText(candidate).width <= maxWidth) {
      lines[lines.length - 1] = candidate
    } else {
      lines.push(word)
    }
  }

  return lines
}

export async function countTitleLines(title: string) {
  if (!title.trim()) {
    return 0
  }

  await loadFonts()
  const ctx = createContext()

  return ctx ? wrapTitle(ctx, title).length : 0
}

function truncate(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) {
    return text
  }

  let end = text.length

  while (end > 0 && ctx.measureText(`${text.slice(0, end)}…`).width > maxWidth) {
    end -= 1
  }

  return `${text.slice(0, end).trimEnd()}…`
}

// Places the baseline the way CSS does: glyphs centered in the line box (half-leading).
function baselineFor(
  ctx: CanvasRenderingContext2D,
  lineTop: number,
  lineHeight: number
) {
  const metrics = ctx.measureText('Hg')
  const ascent = metrics.fontBoundingBoxAscent
  const descent = metrics.fontBoundingBoxDescent

  return lineTop + (lineHeight - (ascent + descent)) / 2 + ascent
}

function drawPhoto(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  positionY: number
) {
  const { x, y, width, height } = PHOTO_WINDOW
  // object-fit: cover; object-position: 50% <positionY>%
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  const offsetX = (width - drawWidth) / 2
  const offsetY = ((height - drawHeight) * positionY) / 100

  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, width, height)
  ctx.clip()
  ctx.drawImage(image, x + offsetX, y + offsetY, drawWidth, drawHeight)
  ctx.fillStyle = 'rgb(0 0 0 / 70%)'
  ctx.fillRect(x, y, width, height)
  ctx.restore()
}

export async function renderJpeg({
  title,
  preacher,
  photo,
  photoPositionY,
}: ThumbnailContent) {
  const [, backgroundImage, photoImage] = await Promise.all([
    loadFonts(),
    loadImage(background),
    photo
      ? loadImage(photo, photo.startsWith('data:') ? undefined : 'anonymous')
      : null,
  ])
  const ctx = createContext()

  if (!ctx) {
    throw new Error('Canvas is not available')
  }

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT)
  ctx.fillStyle = '#24211c'
  ctx.fillRect(
    PHOTO_WINDOW.x,
    PHOTO_WINDOW.y,
    PHOTO_WINDOW.width,
    PHOTO_WINDOW.height
  )

  if (photoImage) {
    drawPhoto(ctx, photoImage, photoPositionY)
  }

  ctx.drawImage(backgroundImage, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT)

  const lines = wrapTitle(ctx, title)
  const titleTop = TITLE.bottom - lines.length * TITLE.lineHeight
  ctx.fillStyle = '#fff'
  lines.forEach((line, index) => {
    const lineTop = titleTop + index * TITLE.lineHeight
    ctx.fillText(line, TEXT_LEFT, baselineFor(ctx, lineTop, TITLE.lineHeight))
  })

  ctx.font = PREACHER.font
  ctx.fillStyle = '#000'
  ctx.fillText(
    truncate(ctx, preacher.toLocaleUpperCase('pt-BR'), PREACHER.maxWidth),
    TEXT_LEFT,
    baselineFor(ctx, PREACHER.bottom - PREACHER.lineHeight, PREACHER.lineHeight)
  )

  return ctx.canvas.toDataURL('image/jpeg', 0.92)
}

export function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement('a')
  link.download = fileName
  link.href = dataUrl
  link.click()
}
