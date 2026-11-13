import type { ClosingData } from '../types'

type SocialKey = 'instagram' | 'youtube' | 'facebook' | 'site'

// Icon shapes on a 24 × 24 grid, drawn with a 1.8 stroke in the preview and the PDF.
export const SOCIALS: { key: SocialKey; name: string; icon: string }[] = [
  {
    key: 'instagram',
    name: 'Instagram',
    icon: 'M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5z M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M17.5 6.2v.6',
  },
  {
    key: 'youtube',
    name: 'YouTube',
    icon: 'M6.5 5h11a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-11a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4z M10 9.2v5.6l4.8-2.8z',
  },
  {
    key: 'facebook',
    name: 'Facebook',
    icon: 'M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z',
  },
  {
    key: 'site',
    name: 'Site',
    icon: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M3 12h18 M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z',
  },
]

export function filledSocials(data: ClosingData) {
  return SOCIALS.filter((social) => data[social.key].trim())
}
