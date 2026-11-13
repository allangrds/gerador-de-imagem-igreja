// @vitest-environment node
import { resolve } from 'node:path'
import { bulletinModels } from './models'
import { renderBulletinPdf } from './exportPdf'

// Vite turns asset imports into dev-server URLs; in Node the PDF reads the files from disk.
vi.mock('./pdf/assets', () => ({
  gillSans: resolve('src/assets/fonts/GillSans.ttf'),
  gillSansBold: resolve('src/assets/fonts/GillSans-Bold.ttf'),
  churchLogo: resolve('src/assets/logo-iasd-belem-vertical-preto.png'),
  churchLogoWhite: resolve('src/assets/logo-iasd-belem-vertical-branco.png'),
}))

function pageOf(type: string, patch = {}) {
  const model = bulletinModels.find((item) => item.type === type)!

  return { id: 1, type, data: { ...model.defaults(), ...patch } }
}

describe('renderBulletinPdf', () => {
  it('draws one page per model with working links', async () => {
    const pages = [
      pageOf('cover'),
      pageOf('calendar'),
      pageOf('event'),
      pageOf('image', {
        image: {
          src: resolve('src/assets/logo-iasd-belem-vertical-preto.png'),
          name: '',
          detail: '',
        },
        link: 'https://iasdbelem.org/cartaz',
      }),
      pageOf('notice'),
      pageOf('photos', { link: 'https://photos.app.goo.gl/album' }),
      pageOf('offerings', {
        pixKey: '12.345.678/0001-90',
        beneficiary: 'Igreja Adventista',
      }),
      pageOf('whatsapp', { link: 'https://chat.whatsapp.com/grupo' }),
      pageOf('closing'),
    ]

    const blob = await renderBulletinPdf(pages)
    const pdf = Buffer.from(await blob.arrayBuffer()).toString('latin1')

    expect(pdf.startsWith('%PDF')).toBe(true)
    expect(pdf.match(/\/Type \/Page\b/g)).toHaveLength(pages.length)
    // Every page keeps the 9:16 size, whatever the amount of content.
    expect(pdf.match(/\/MediaBox \[0 0 540 960\]/g)).toHaveLength(pages.length)
    expect(pdf).toContain('/URI (https://chat.whatsapp.com/grupo)')
    expect(pdf).toContain('/URI (https://photos.app.goo.gl/album)')
    expect(pdf).toContain('/URI (https://iasdbelem.org/cartaz)')
    expect(pdf).toContain(
      '/URI (https://www.instagram.com/adventistas_belemsp/)'
    )
    expect(pdf).toContain('/URI (https://www.youtube.com/@iasdbelemsp)')
    // Real text: the Gill Sans subset is embedded instead of drawing the words as shapes.
    expect(pdf).toMatch(/\/FontFile2|\/FontFile3|\/FontFile /)
  })
})
