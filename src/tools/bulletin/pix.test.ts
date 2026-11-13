import { buildPixPayload } from './pix'

describe('buildPixPayload', () => {
  it('matches the static example from the Banco Central BR Code manual', () => {
    expect(
      buildPixPayload({
        key: '123e4567-e12b-12d1-a456-426655440000',
        name: 'Fulano de Tal',
        city: 'BRASILIA',
      })
    ).toBe(
      '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D'
    )
  })

  it('removes accents and cuts the name to 25 and the city to 15 characters', () => {
    const payload = buildPixPayload({
      key: 'igreja@exemplo.com',
      name: 'Associação Paulista Central da Igreja',
      city: 'São Paulo do Belenzinho',
    })

    expect(payload).toContain('5925Associacao Paulista Centr')
    expect(payload).toContain('6015Sao Paulo do Be6')
  })

  it('keeps only the digits of a CNPJ or phone key formatted with punctuation', () => {
    expect(
      buildPixPayload({
        key: '12.345.678/0001-90',
        name: 'Igreja',
        city: 'SAO PAULO',
      })
    ).toContain('011412345678000190')
  })
})
