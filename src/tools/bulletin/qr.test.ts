import QRCode from 'qrcode'
import { qrPath } from './qr'

describe('qrPath', () => {
  it('draws one rectangle per run of dark modules', () => {
    const { size, path } = qrPath('https://chat.whatsapp.com/abc')
    const { modules } = QRCode.create('https://chat.whatsapp.com/abc', {
      errorCorrectionLevel: 'M',
    })

    expect(size).toBe(modules.size)
    // The top-left finder pattern starts with a run of 7 dark modules.
    expect(path.startsWith('M0 0h7v1h-7z')).toBe(true)
  })
})
