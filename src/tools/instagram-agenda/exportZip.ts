import type { Page } from '../../components/page-builder/usePageList'
import { slugify } from '../../lib/slugify'
import { loadArt } from './art'
import { ART_WIDTH } from './art/canvas'
import { agendaModels } from './models'

function toJpeg(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('Could not create the JPG')),
      'image/jpeg',
      0.92
    )
  )
}

// jsdom's Blob has no arrayBuffer(), so read it the old way.
function readBytes(blob: Blob) {
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer))
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(blob)
  })
}

// Draws each image with the same canvas art as the preview, at 1080 px wide.
export async function renderAgendaZip(pages: Page[]) {
  const { zipSync } = await import('fflate')
  const files: Record<string, Uint8Array> = {}

  for (const [index, page] of pages.entries()) {
    const model = agendaModels.find((item) => item.type === page.type)!
    const paint = await loadArt(page.type, page.data)
    const canvas = document.createElement('canvas')
    paint(canvas, ART_WIDTH)

    const number = String(index + 1).padStart(2, '0')
    files[`${number}-${slugify(model.name)}.jpg`] = await readBytes(
      await toJpeg(canvas)
    )
  }

  // The JPGs are already compressed, so they go into the zip as they are.
  return new Blob([zipSync(files, { level: 0 })], { type: 'application/zip' })
}
