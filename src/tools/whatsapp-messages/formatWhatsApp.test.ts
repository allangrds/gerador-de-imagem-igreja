import { toSegments } from './formatWhatsApp'

describe('toSegments', () => {
  it('splits bold, italic and strikethrough', () => {
    expect(toSegments('Oi *forte* e _leve_ ~não~')).toEqual([
      { text: 'Oi ', style: 'plain' },
      { text: 'forte', style: 'bold' },
      { text: ' e ', style: 'plain' },
      { text: 'leve', style: 'italic' },
      { text: ' ', style: 'plain' },
      { text: 'não', style: 'strike' },
    ])
  })

  it('finds links', () => {
    expect(toSegments('Assista: https://youtube.com/x')).toEqual([
      { text: 'Assista: ', style: 'plain' },
      { text: 'https://youtube.com/x', style: 'plain', link: true },
    ])
  })

  it('leaves a lonely asterisk alone', () => {
    expect(toSegments('2 * 3')).toEqual([{ text: '2 * 3', style: 'plain' }])
  })
})
