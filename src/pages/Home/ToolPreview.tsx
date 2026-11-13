import type { PageModel } from '../../components/page-builder/types'
import { bulletinModels } from '../../tools/bulletin/models'
import { agendaModels } from '../../tools/instagram-agenda/models'
import { buildMessage } from '../../tools/whatsapp-messages/buildMessage'
import { messageDefaults } from '../../tools/whatsapp-messages/models'
import { ThumbnailArt } from '../../tools/youtube-thumbnail/ThumbnailArt'
import { SAMPLE_THUMBNAIL } from '../../tools/youtube-thumbnail/sample'
import styles from './ToolCard.module.css'

function PagesPreview({
  models,
  types,
}: {
  models: PageModel[]
  types: string[]
}) {
  return (
    <div className={styles.pages} aria-hidden="true">
      {types.map((type) => {
        const model = models.find((item) => item.type === type)!

        return (
          <div key={type} className={styles.page}>
            <model.Preview data={(model.sample ?? model.defaults)()} />
          </div>
        )
      })}
    </div>
  )
}

function MessagePreview() {
  const lines = buildMessage('culto', messageDefaults('culto'), true)
    .split('\n')
    .slice(0, 6)

  return (
    <div className={styles.chat} aria-hidden="true">
      <div className={styles.bubble}>
        {lines.map((line, index) => (
          <span key={index}>{line.replace(/[*_]/g, '') || '\u00a0'}</span>
        ))}
      </div>
    </div>
  )
}

export function ToolPreview({ id }: { id: string }) {
  if (id === 'whatsapp-messages') {
    return <MessagePreview />
  }

  if (id === 'instagram-agenda') {
    return (
      <PagesPreview
        models={agendaModels}
        types={['cover', 'dates', 'closing']}
      />
    )
  }

  return id === 'bulletin' ? (
    <PagesPreview
      models={bulletinModels}
      types={['cover', 'calendar', 'closing']}
    />
  ) : (
    <ThumbnailArt {...SAMPLE_THUMBNAIL} />
  )
}
