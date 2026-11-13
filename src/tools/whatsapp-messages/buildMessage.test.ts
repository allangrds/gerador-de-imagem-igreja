import { buildMessage } from './buildMessage'
import { messageDefaults, messageModels } from './models'

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

  it('has every model of the church line, plus the original ones', () => {
    expect(messageModels.map((model) => model.name)).toEqual([
      'Culto de sábado',
      'Culto de quarta-feira',
      'Inscrição para retiro',
      'Inscrição para retiro de casais',
      'Inscrição para retiro jovem',
      'Pedido de alimentos para a ASA',
      'Missão Urbana da ASA',
      'Recomendação de livro da biblioteca',
      'Semana de oração temática',
      'Culto de sábado temático',
      'Domingo da feijoada vegana',
      'Domingo da social junina',
      'Faça parte de um ministério',
      'Oferte',
      'Dízimo',
      'Classe bíblica — módulo 1',
      'Clube do livro',
      'Convite para o culto',
      'Estamos ao vivo',
      'Aviso',
      'Evento com inscrição',
      'Aniversariantes',
      'Boas-vindas',
    ])
  })

  it('fills the line template and keeps the placeholder of empty fields', () => {
    const data = {
      ...messageDefaults('culto-sabado'),
      assunto: 'esperança',
      data: 'Sábado, 21 de novembro',
    }

    expect(buildMessage('culto-sabado', data, true)).toBe(
      [
        '*Neste sábado, venha adorar com a gente*',
        '',
        'Vamos nos reunir para louvar a Deus, orar e estudar a Bíblia. Você e sua família estão convidados.',
        '',
        'A mensagem será sobre esperança, com [nome de quem apresentará a mensagem].',
        '',
        '📅 Sábado, 21 de novembro',
        '',
        '🕘 [horário do culto]',
        '',
        '📍 Comunidade Adventista do Belém — Rua Martim Affonso, 152 · Belenzinho, São Paulo',
        '',
        'É sua primeira visita? Envie uma mensagem por aqui se precisar de orientações para chegar.',
      ].join('\n')
    )
  })

  it('drops the leading emojis of the template when they are off', () => {
    const text = buildMessage(
      'culto-sabado',
      messageDefaults('culto-sabado'),
      false
    )

    expect(text).toContain('\n[horário do culto]\n')
    expect(text).not.toMatch(/📅|🕘|📍/)
  })

  it('writes one list item per line', () => {
    const text = buildMessage(
      'asa-alimentos',
      { alimentos: 'Arroz, 10 kg\n\nFeijão, 5 kg' },
      true
    )

    expect(text).toContain(
      'Neste momento, precisamos de:\n\n- Arroz, 10 kg\n- Feijão, 5 kg\n\n'
    )
  })

  it('shows optional lines only when they are filled', () => {
    const empty = buildMessage('feijoada', messageDefaults('feijoada'), true)
    const filled = buildMessage(
      'feijoada',
      { ...messageDefaults('feijoada'), destinacao: 'a reforma da cozinha' },
      true
    )

    expect(empty).not.toContain('Destinação')
    expect(empty.endsWith('envie *FEIJOADA* por mensagem.')).toBe(true)
    expect(filled).toContain(
      '\n\nDestinação da arrecadação: a reforma da cozinha.'
    )
  })

  it('writes the ministry keyword in capitals', () => {
    const text = buildMessage(
      'ministerio',
      { ...messageDefaults('ministerio'), ministerio: 'Ministério da Música' },
      true
    )

    expect(
      text.startsWith('*Tem espaço para você no Ministério da Música*')
    ).toBe(true)
    expect(text).toContain('Envie *MINISTÉRIO DA MÚSICA* por mensagem.')
  })
})
