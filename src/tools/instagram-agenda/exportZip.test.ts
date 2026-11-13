import { unzipSync } from 'fflate'
import { domToJpeg } from 'modern-screenshot'
import { agendaModels } from './models'
import { renderAgendaZip } from './exportZip'

vi.mock('modern-screenshot', () => ({
  domToJpeg: vi.fn().mockResolvedValue(`data:image/jpeg;base64,${btoa('jpg')}`),
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

  it('captures each image at 1080 × 1350', async () => {
    await renderAgendaZip([pageOf(1, 'cover')])

    expect(domToJpeg).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ width: 1080, height: 1350 })
    )
  })

  it('cleans up the hidden render area', async () => {
    await renderAgendaZip([pageOf(1, 'cover')])

    expect(document.body.children).toHaveLength(0)
  })
})
