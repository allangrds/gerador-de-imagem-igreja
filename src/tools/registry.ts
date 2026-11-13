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
    id: 'instagram-post',
    name: 'Post para Instagram',
    description: 'Divulgação de programações e pregadores convidados no feed.',
    size: '1080 × 1350',
    status: 'soon',
    aspectRatio: '4 / 5',
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
