export type Segment = {
  text: string
  style: 'plain' | 'bold' | 'italic' | 'strike'
  link?: true
}

const MARKS = /(\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~)/
const STYLES = { '*': 'bold', _: 'italic', '~': 'strike' } as const

// Splits one line the way WhatsApp shows it: *bold*, _italic_, ~strike~ and links.
export function toSegments(line: string): Segment[] {
  return line
    .split(MARKS)
    .filter(Boolean)
    .flatMap((part) => {
      const marked = MARKS.test(part) && part.length > 2
      const style = marked
        ? STYLES[part[0] as keyof typeof STYLES]
        : ('plain' as const)
      const text = marked ? part.slice(1, -1) : part

      return text
        .split(/(https?:\/\/\S+)/)
        .filter(Boolean)
        .map((piece) =>
          /^https?:\/\//.test(piece)
            ? { text: piece, style, link: true as const }
            : { text: piece, style }
        )
    })
}
