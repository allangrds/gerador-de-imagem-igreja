// Static Pix "copia e cola" (BR Code), following the Banco Central EMV layout.

export type PixData = {
  key: string
  name: string
  city: string
}

function field(id: string, value: string) {
  return `${id}${String(value.length).padStart(2, '0')}${value}`
}

function plain(value: string, maxLength: number) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().slice(0, maxLength)
}

// CPF/CNPJ and phone keys are registered without punctuation.
function normalizeKey(key: string) {
  const trimmed = key.trim()

  if (/^\+?[\d.\-/\s()]+$/.test(trimmed)) {
    return `${trimmed.startsWith('+') ? '+' : ''}${trimmed.replace(/\D/g, '')}`
  }

  return trimmed
}

// CRC16-CCITT (polynomial 0x1021, initial value 0xFFFF).
function crc16(payload: string) {
  let crc = 0xffff

  for (const byte of new TextEncoder().encode(payload)) {
    crc ^= byte << 8

    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function buildPixPayload({ key, name, city }: PixData) {
  const payload = [
    field('00', '01'),
    field('26', field('00', 'br.gov.bcb.pix') + field('01', normalizeKey(key))),
    field('52', '0000'),
    field('53', '986'),
    field('58', 'BR'),
    field('59', plain(name, 25)),
    field('60', plain(city, 15)),
    field('62', field('05', '***')),
    '6304',
  ].join('')

  return payload + crc16(payload)
}
