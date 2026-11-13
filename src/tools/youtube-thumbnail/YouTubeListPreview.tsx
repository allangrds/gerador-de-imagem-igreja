import styles from './Editor.module.css'
import { ThumbnailArt } from './ThumbnailArt'
import type { Photo } from './photo'

type YouTubeListPreviewProps = {
  title: string
  preacher: string
  photo: Photo | null
  photoPositionY: number
}

export function YouTubeListPreview({
  title,
  preacher,
  photo,
  photoPositionY,
}: YouTubeListPreviewProps) {
  return (
    <section aria-labelledby="como-aparece" className={styles.listPreview}>
      <div className={styles.listPreviewText}>
        <h2 id="como-aparece" className={styles.panelTitleSmall}>
          Como aparece no YouTube
        </h2>
        <p className={styles.muted}>
          No celular a capa fica pequena. Confira se o título continua legível.
        </p>
      </div>
      <div className={styles.listItem} aria-hidden="true">
        <div className={styles.listThumb}>
          <ThumbnailArt
            title={title}
            preacher={preacher}
            photo={photo?.src}
            photoPositionY={photoPositionY}
          />
        </div>
        <span className={styles.listTitle}>
          Culto · {title || 'Título da mensagem'}
        </span>
        <span className={styles.listChannel}>Comunidade Adventista do Belém</span>
      </div>
    </section>
  )
}
