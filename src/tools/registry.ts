export type Tool = {
  id: string
  name: string
  description: string
  size: string
  status: 'available' | 'soon'
  path?: string
  aspectRatio?: string
}

export const tools: Tool[] = [
  {
    id: 'youtube-thumbnail',
    name: 'Thumbnail para YouTube',
    description:
      'Capa das transmissões dos cultos: foto do pregador, título da mensagem e nome, no layout oficial preto e dourado.',
    size: '1280 × 720 · JPG',
    status: 'available',
    path: '/thumbnail-youtube',
  },
  {
    id: 'bulletin',
    name: 'Boletim em PDF',
    description:
      'Junte páginas prontas (capa, agenda, eventos, avisos, dízimos e redes) na ordem que quiser e baixe o boletim.',
    size: 'PDF · 1080 × 1920',
    status: 'available',
    path: '/boletim',
  },
  {
    id: 'instagram-story',
    name: 'Story de avisos',
    description: 'Avisos da semana e convites no formato vertical dos stories.',
    size: '1080 × 1920',
    status: 'soon',
    aspectRatio: '9 / 16',
  },
]
