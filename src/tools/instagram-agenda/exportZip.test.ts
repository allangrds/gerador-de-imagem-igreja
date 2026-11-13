import { unzipSync } from 'fflate'
import { loadArt } from './art'
import { agendaModels } from './models'
import { renderAgendaZip } from './exportZip'

const paint = vi.fn()

vi.mock('./art', () => ({
  loadArt: vi.fn(async () => paint),
}))

function pageOf(id: number, type: string) {
  const model = agendaModels.find((item) => item.type === type)!

  return { id, type, data: model.defaults() }
}

// jsdom's Blob has no arrayBuffer(), so read it the old way.
function readBlob(blob: Blob) {
  return new Promise<Uint8Array>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer))
    reader.readAsArrayBuffer(blob)
  })
}

beforeEach(() => {
  // jsdom has no canvas, so the JPG is a stand-in.
  HTMLCanvasElement.prototype.toBlob = function (callback, type) {
    callback(new Blob(['jpg'], { type }))
  }
})

describe('renderAgendaZip', () => {
  it('saves one numbered JPG per image, in the carousel order', async () => {
    const zip = await renderAgendaZip([
      pageOf(1, 'cover'),
      pageOf(2, 'dates'),
      pageOf(3, 'dates'),
      pageOf(4, 'closing'),
    ])
    const files = unzipSync(await readBlob(zip))

    expect(Object.keys(files)).toEqual([
      '01-capa.jpg',
      '02-datas.jpg',
      '03-datas.jpg',
      '04-final.jpg',
    ])
    expect(new TextDecoder().decode(files['01-capa.jpg'])).toBe('jpg')
  })

  it('draws each image with its own art and data, 1080 px wide', async () => {
    const cover = pageOf(1, 'cover')
    await renderAgendaZip([cover])

    expect(loadArt).toHaveBeenCalledWith('cover', cover.data)
    expect(paint).toHaveBeenCalledWith(expect.any(HTMLCanvasElement), 1080)
  })
})
