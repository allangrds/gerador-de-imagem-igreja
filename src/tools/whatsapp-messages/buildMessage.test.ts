import { buildMessage } from './buildMessage'
import { messageDefaults } from './models'

describe('buildMessage', () => {
  it('writes the service invitation with emojis', () => {
    expect(buildMessage('culto', messageDefaults('culto'), true)).toBe(
      [
        '⛪ *Culto de sábado*',
        '',
        '📅 *Sábado, 15 de novembro*',
        '🕘 9h · Escola Sabatina',
        '🕘 11h · Culto divino',
        '',
        '🎤 Pregador: *Pr. Thiago da Silva*',
        '📖 Tema: _Compaixão pelos imperdoáveis_',
        '',
        '📍 Rua Martim Affonso, 152 · Belenzinho',
        '',
        'Não pode vir? Assista ao vivo:',
        'https://youtube.com/@[canal]',
      ].join('\n')
    )
  })

  it('uses bullets instead of emojis when they are off', () => {
    const text = buildMessage('culto', messageDefaults('culto'), false)

    expect(text).toContain('*Culto de sábado*\n')
    expect(text).toContain('• 9h · Escola Sabatina')
    expect(text).not.toMatch(/⛪|🕘/)
  })

  it('skips empty lines in lists', () => {
    const text = buildMessage(
      'aniversario',
      { semana: 'Semana', lista: '17/11 · Maria\n\n  \n19/11 · João' },
      false
    )

    expect(text).toContain('• 17/11 · Maria\n• 19/11 · João')
  })

  it('keeps the paragraphs of a notice', () => {
    expect(
      buildMessage(
        'aviso',
        { titulo: 'Aviso', texto: 'Um\n\nDois', assinatura: 'Secretaria' },
        false
      )
    ).toBe('*Aviso*\n\nUm\n\nDois\n\n_Secretaria_')
  })

  it('welcomes a visitor', () => {
    const text = buildMessage(
      'visitante',
      { nome: 'Carla', horarios: 'Sábado, 11h' },
      true
    )

    expect(text.startsWith('Olá, Carla! 😊')).toBe(true)
    expect(text).toContain('• Sábado, 11h')
  })
})
