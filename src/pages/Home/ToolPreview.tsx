import type { PageModel } from '../../components/page-builder/types'
import { bulletinModels } from '../../tools/bulletin/models'
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

export function ToolPreview({ id }: { id: string }) {
  return id === 'bulletin' ? (
    <PagesPreview
      models={bulletinModels}
      types={['cover', 'calendar', 'closing']}
    />
  ) : (
    <ThumbnailArt {...SAMPLE_THUMBNAIL} />
  )
}
