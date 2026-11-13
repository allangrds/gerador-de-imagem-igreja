import type { PageData } from '../../../components/page-builder/usePageList'

export const ART_WIDTH = 1080
export const ART_HEIGHT = 1350

// Sizes are written in % of the image width, the unit the art was designed in.
export function w(percent: number) {
  return (ART_WIDTH * percent) / 100
}

export const COLORS = {
  ink: '#141210',
  inkSoft: '#4a4535',
  paper: '#f6f2e9',
  gold: '#c6b98c',
  goldDeep: '#8c7f55',
  oliveText: '#5f5944',
  lineStrong: '#cfc6ae',
  swipe: '#e9e3d3',
}

export const LINE_HEIGHT = 1.2

export function artFont(weight: 400 | 700, size: number) {
  return `${weight} ${size}px GillSans, "Gill Sans", "Gill Sans MT", Cabin, sans-serif`
}

export function upper(text: string) {
  return text.toLocaleUpperCase('pt-BR')
}

export type Art<D = PageData> = {
  // Images the art needs, loaded before drawing; a missing one comes as null.
  images: (data: D) => (string | null | undefined)[]
  draw: (
    ctx: CanvasRenderingContext2D,
    data: D,
    images: (HTMLImageElement | null)[]
  ) => void
  // What the image says, for screen readers.
  label: (data: D) => string
}

// Lets each art keep its own data type inside the list of arts.
export function defineArt<D extends PageData>(art: Art<D>) {
  return art as unknown as Art
}

export function fillBackground(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(0, 0, ART_WIDTH, ART_HEIGHT)
}

export function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
  ctx.fill()
}

// A 24 × 24 line icon (stroke 2, round ends), drawn at `size`.
export function drawIcon(
  ctx: CanvasRenderingContext2D,
  paths: string[],
  x: number,
  y: number,
  size: number,
  color: string
) {
  const path = new Path2D(paths.join(' '))

  ctx.save()
  ctx.translate(x, y)
  ctx.scale(size / 24, size / 24)
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke(path)
  ctx.restore()
}
