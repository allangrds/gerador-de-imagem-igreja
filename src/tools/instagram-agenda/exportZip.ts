import { createElement } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import type { Page } from '../../components/page-builder/usePageList'
import { slugify } from '../../lib/slugify'
import { agendaModels } from './models'

const IMAGE_WIDTH = 1080
const IMAGE_HEIGHT = 1350

function dataUrlToBytes(dataUrl: string) {
  const binary = atob(dataUrl.slice(dataUrl.indexOf(',') + 1))

  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

// Photos and the Gill Sans must be ready, or the capture comes out without them.
async function settle(node: HTMLElement) {
  await Promise.all(
    [...node.querySelectorAll('img')].map((image) =>
      image.decode?.().catch(() => undefined)
    )
  )
  await document.fonts?.ready
}

// Draws each image with the same component as the preview, at 1080 px wide, off screen.
export async function renderAgendaZip(pages: Page[]) {
  const [{ domToJpeg }, { zipSync }] = await Promise.all([
    import('modern-screenshot'),
    import('fflate'),
  ])
  const area = document.createElement('div')
  area.setAttribute('aria-hidden', 'true')
  area.style.cssText = `position: fixed; top: 0; left: -${IMAGE_WIDTH * 2}px; width: ${IMAGE_WIDTH}px; pointer-events: none;`
  document.body.append(area)
  const root = createRoot(area)
  const files: Record<string, Uint8Array> = {}

  try {
    for (const [index, page] of pages.entries()) {
      const model = agendaModels.find((item) => item.type === page.type)!

      flushSync(() =>
        root.render(createElement(model.Preview, { data: page.data }))
      )
      const node = area.firstElementChild as HTMLElement
      await settle(node)

      const jpeg = await domToJpeg(node, {
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        scale: 1,
        quality: 0.92,
      })
      const number = String(index + 1).padStart(2, '0')
      files[`${number}-${slugify(model.name)}.jpg`] = dataUrlToBytes(jpeg)
    }
  } finally {
    root.unmount()
    area.remove()
  }

  // The JPGs are already compressed, so they go into the zip as they are.
  return new Blob([zipSync(files, { level: 0 })], { type: 'application/zip' })
}
