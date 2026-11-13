import type { PageData } from '../../../components/page-builder/usePageList'
import { loadImage } from '../../../lib/image'
import { ART_HEIGHT, ART_WIDTH, artFont } from './canvas'
import type { Art } from './canvas'
import { closingArt } from './closing'
import { coverArt } from './cover'
import { datesArt } from './dates'

export { ART_HEIGHT, ART_WIDTH }

export const agendaArt: Record<string, Art> = {
  cover: coverArt,
  dates: datesArt,
  closing: closingArt,
}

// Canvas text only uses web fonts that are already loaded, so load them first.
function loadFonts() {
  return Promise.all(
    [400, 700].map((weight) =>
      document.fonts?.load(artFont(weight as 400 | 700, 10))
    )
  )
}

// A broken image is left out instead of failing the whole art.
function loadOptional(src: string | null | undefined) {
  return src ? loadImage(src).catch(() => null) : Promise.resolve(null)
}

// Loads what the art needs and hands back the function that paints it, so the preview
// and the JPG come from the same drawing in any browser.
export async function loadArt(type: string, data: PageData) {
  const art = agendaArt[type]
  const [images] = await Promise.all([
    Promise.all(art.images(data).map(loadOptional)),
    loadFonts(),
  ])

  // Drawn in 1080 px units and scaled, so a small preview has the same layout as the JPG.
  return (canvas: HTMLCanvasElement, width: number) => {
    const scale = width / ART_WIDTH
    canvas.width = width
    canvas.height = Math.round(ART_HEIGHT * scale)
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas is not available')
    }

    ctx.scale(scale, scale)
    art.draw(ctx, data, images)
  }
}
