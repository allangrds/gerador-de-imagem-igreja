import QRCode from 'qrcode'

// An SVG path of the dark modules, so the same code draws the QR in the preview and in the PDF.
export function qrPath(text: string) {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: 'M' })
  const { size } = modules
  let path = ''

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!modules.get(y, x)) {
        continue
      }

      let run = 1

      while (x + run < size && modules.get(y, x + run)) {
        run++
      }

      path += `M${x} ${y}h${run}v1h-${run}z`
      x += run - 1
    }
  }

  return { size, path }
}
