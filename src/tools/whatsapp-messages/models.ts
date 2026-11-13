export type MessageType =
  'culto' | 'aovivo' | 'aviso' | 'evento' | 'aniversario' | 'visitante'

export type MessageField = {
  key: string
  label: string
  defaultValue: string
  multiline?: boolean
  hint?: string
}

export type MessageModel = {
  type: MessageType
  name: string
  description: string
  fields: MessageField[]
}

export type MessageData = Record<string, string>

export const messageModels: MessageModel[] = [
  {
    type: 'culto',
    name: 'Convite para o culto',
    description: 'Data, horários e pregador',
    fields: [
      { key: 'titulo', label: 'Título', defaultValue: 'Culto de sábado' },
      {
        key: 'data',
        label: 'Data',
        defaultValue: 'Sábado, 15 de novembro',
        hint: 'Escreva como deve aparecer na mensagem.',
      },
      {
        key: 'horarios',
        label: 'Programação',
        defaultValue: '9h · Escola Sabatina\n11h · Culto divino',
        multiline: true,
        hint: 'Um horário por linha.',
      },
      {
        key: 'pregador',
        label: 'Pregador',
        defaultValue: 'Pr. Thiago da Silva',
      },
      {
        key: 'tema',
        label: 'Tema da mensagem',
        defaultValue: 'Compaixão pelos imperdoáveis',
      },
      {
        key: 'link',
        label: 'Link da transmissão',
        defaultValue: 'https://youtube.com/@[canal]',
      },
    ],
  },
  {
    type: 'aovivo',
    name: 'Estamos ao vivo',
    description: 'Aviso de transmissão',
    fields: [
      {
        key: 'tema',
        label: 'Tema da mensagem',
        defaultValue: 'Compaixão pelos imperdoáveis',
      },
      {
        key: 'pregador',
        label: 'Pregador',
        defaultValue: 'Pr. Thiago da Silva',
      },
      {
        key: 'link',
        label: 'Link da transmissão',
        defaultValue: 'https://youtube.com/@[canal]',
      },
    ],
  },
  {
    type: 'aviso',
    name: 'Aviso',
    description: 'Título e texto livre',
    fields: [
      {
        key: 'titulo',
        label: 'Título do aviso',
        defaultValue: 'Novo horário do culto de quarta',
      },
      {
        key: 'texto',
        label: 'Texto',
        defaultValue:
          'A partir de 19 de novembro, o culto de quarta-feira começa às *19h30*.\n\nTraga sua família e venha orar com a gente!',
        multiline: true,
        hint: 'Pode usar *negrito* e _itálico_.',
      },
      {
        key: 'assinatura',
        label: 'Assinatura',
        defaultValue: 'Secretaria da IASD Belém',
      },
    ],
  },
  {
    type: 'evento',
    name: 'Evento com inscrição',
    description: 'Data, local, valor e link',
    fields: [
      {
        key: 'nome',
        label: 'Nome do evento',
        defaultValue: 'Retiro de casais',
      },
      { key: 'data', label: 'Data', defaultValue: '6 a 8 de dezembro' },
      { key: 'local', label: 'Local', defaultValue: '[local do retiro]' },
      { key: 'valor', label: 'Valor', defaultValue: 'R$ [valor] por casal' },
      {
        key: 'prazo',
        label: 'Prazo',
        defaultValue: 'Inscrições até 30 de novembro',
      },
      {
        key: 'link',
        label: 'Link da inscrição',
        defaultValue: 'https://[link-da-inscrição]',
      },
    ],
  },
  {
    type: 'aniversario',
    name: 'Aniversariantes',
    description: 'Lista da semana',
    fields: [
      {
        key: 'semana',
        label: 'Período',
        defaultValue: 'Semana de 16 a 22 de novembro',
      },
      {
        key: 'lista',
        label: 'Aniversariantes',
        defaultValue:
          '17/11 · Maria Souza\n19/11 · João Pereira\n21/11 · Ana Lima',
        multiline: true,
        hint: 'Um por linha: data e nome.',
      },
    ],
  },
  {
    type: 'visitante',
    name: 'Boas-vindas',
    description: 'Para quem nos visitou',
    fields: [
      { key: 'nome', label: 'Nome do visitante', defaultValue: 'Carla' },
      {
        key: 'horarios',
        label: 'Horários dos cultos',
        defaultValue:
          'Sábado, 9h · Escola Sabatina\nSábado, 11h · Culto divino',
        multiline: true,
        hint: 'Um por linha.',
      },
    ],
  },
]

export function messageDefaults(type: MessageType): MessageData {
  const model = messageModels.find((item) => item.type === type)!

  return Object.fromEntries(
    model.fields.map((field) => [field.key, field.defaultValue])
  )
}
