const WEEKDAYS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]
const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

// Dates come from <input type="date"> as YYYY-MM-DD; read them as local days.
function parse(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  return value ? new Date(year, month - 1, day) : null
}

export function weekday(value: string) {
  const date = parse(value)

  return date ? WEEKDAYS[date.getDay()] : ''
}

export function longDate(value: string) {
  const date = parse(value)

  return date
    ? `${WEEKDAYS[date.getDay()]}, ${date.getDate()} de ${MONTHS[date.getMonth()]}`
    : ''
}

export function dayAndMonth(value: string) {
  const date = parse(value)

  return date
    ? {
        day: String(date.getDate()).padStart(2, '0'),
        month: MONTHS[date.getMonth()].slice(0, 3).toUpperCase(),
      }
    : { day: '', month: '' }
}

export function monthName(date: Date) {
  const month = MONTHS[date.getMonth()]

  return `${month.charAt(0).toUpperCase()}${month.slice(1)}`
}

export function monthAndYear(date: Date) {
  return `${monthName(date)} · ${date.getFullYear()}`
}

// 19 and 30 become "19h30"; whole hours stay short, like "19h".
export function formatTime(hour: string, minute: string) {
  if (!hour) {
    return ''
  }

  return Number(minute) ? `${hour}h${minute.padStart(2, '0')}` : `${hour}h`
}

export function joinParts(parts: string[]) {
  return parts.filter(Boolean).join(' · ')
}

export function sortByDate<T extends { date: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    if (!a.date || !b.date) {
      return Number(!a.date) - Number(!b.date)
    }

    return a.date.localeCompare(b.date)
  })
}

// Gill Sans Bold capitals are about 0.82 em wide on average. Titles shrink so that
// no single word runs past the text column (84% of the page between the margins).
const CAPITAL_WIDTH = 0.82

export function titleSize(text: string, size: number, column = 84) {
  const longest = Math.max(0, ...text.split(/\s+/).map((word) => word.length))

  return Math.min(size, column / (longest * CAPITAL_WIDTH))
}
