import type { MessageData, MessageType } from './models'

const ADDRESS = 'Rua Martim Affonso, 152 · Belenzinho'

// One item per non-empty line, each starting with the given mark.
function items(text: string, mark: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => mark + line)
}

// Returns plain text with the WhatsApp marks (*bold*, _italic_), ready to paste.
export function buildMessage(
  type: MessageType,
  data: MessageData,
  emojis: boolean
) {
  const icon = (emoji: string) => (emojis ? `${emoji} ` : '')
  const bullet = (emoji: string) => (emojis ? `${emoji} ` : '• ')

  const lines: Record<MessageType, () => string[]> = {
    culto: () => [
      `${icon('⛪')}*${data.titulo}*`,
      '',
      `${icon('📅')}*${data.data}*`,
      ...items(data.horarios, bullet('🕘')),
      '',
      `${icon('🎤')}Pregador: *${data.pregador}*`,
      `${icon('📖')}Tema: _${data.tema}_`,
      '',
      `${icon('📍')}${ADDRESS}`,
      '',
      'Não pode vir? Assista ao vivo:',
      data.link,
    ],
    aovivo: () => [
      `${icon('🔴')}*ESTAMOS AO VIVO!*`,
      '',
      `_${data.tema}_`,
      `com ${data.pregador}`,
      '',
      'Assista e compartilhe:',
      data.link,
    ],
    aviso: () => [
      `${icon('📢')}*${data.titulo}*`,
      '',
      ...data.texto.split('\n'),
      '',
      `_${data.assinatura}_`,
    ],
    evento: () => [
      `${icon('✨')}*${data.nome}*`,
      '',
      `${icon('📅')}${data.data}`,
      `${icon('📍')}${data.local}`,
      `${icon('💰')}${data.valor}`,
      '',
      `${icon('⏳')}*${data.prazo}*`,
      `Inscreva-se: ${data.link}`,
    ],
    aniversario: () => [
      `${icon('🎂')}*Aniversariantes da semana*`,
      `_${data.semana}_`,
      '',
      ...items(data.lista, bullet('🎉')),
      '',
      'Que Deus abençoe cada um com saúde e alegria. Parabéns!',
    ],
    visitante: () => [
      `Olá, ${data.nome}!${emojis ? ' 😊' : ''}`,
      '',
      'Foi uma alegria ter você com a gente na *IASD Belém*.',
      '',
      'Esperamos te ver de novo! Nossos cultos:',
      ...items(data.horarios, '• '),
      '',
      `Qualquer coisa, é só chamar por aqui.${emojis ? ' 🙏' : ''}`,
    ],
  }

  return lines[type]().join('\n')
}
