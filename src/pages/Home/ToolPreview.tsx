import { bulletinModels } from '../../tools/bulletin/models'
import { ThumbnailArt } from '../../tools/youtube-thumbnail/ThumbnailArt'
import { SAMPLE_THUMBNAIL } from '../../tools/youtube-thumbnail/sample'
import styles from './ToolCard.module.css'

const SAMPLE_EVENTS = [
  { date: '2026-11-21', time: '9h', name: 'Retiro de casais', description: '' },
  { date: '2026-11-28', time: '11h', name: 'Ação de graças', description: '' },
  {
    date: '2026-12-19',
    time: '19h',
    name: 'Cantata de Natal',
    description: '',
  },
]

function BulletinPreview() {
  const pages = ['cover', 'calendar', 'closing'].map((type) =>
    bulletinModels.find((model) => model.type === type)!
  )

  return (
    <div className={styles.pages} aria-hidden="true">
      {pages.map((model) => (
        <div key={model.type} className={styles.page}>
          <model.Preview
            data={
              model.type === 'calendar'
                ? { title: 'Próximos eventos', events: SAMPLE_EVENTS }
                : model.defaults()
            }
          />
        </div>
      ))}
    </div>
  )
}

export function ToolPreview({ id }: { id: string }) {
  return id === 'bulletin' ? (
    <BulletinPreview />
  ) : (
    <ThumbnailArt {...SAMPLE_THUMBNAIL} />
  )
}
