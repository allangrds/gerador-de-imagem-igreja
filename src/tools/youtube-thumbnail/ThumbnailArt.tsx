import background from '../../assets/thumbnail-background.png'
import styles from './ThumbnailArt.module.css'

type ThumbnailArtProps = {
  title: string
  preacher: string
  photo?: string | null
  photoPositionY?: number
  showPlaceholders?: boolean
}

export function ThumbnailArt({
  title,
  preacher,
  photo,
  photoPositionY = 30,
  showPlaceholders = true,
}: ThumbnailArtProps) {
  const hasTitle = title.trim() !== ''
  const hasPreacher = preacher.trim() !== ''

  return (
    <div
      className={styles.art}
      role="img"
      aria-label={`Thumbnail: ${title || 'sem título'}, ${preacher || 'sem pregador'}`}
    >
      <div className={styles.photoWindow}>
        {photo ? (
          <>
            <img
              className={styles.photo}
              src={photo}
              alt=""
              crossOrigin={photo.startsWith('data:') ? undefined : 'anonymous'}
              style={{ objectPosition: `50% ${photoPositionY}%` }}
            />
            <div className={styles.overlay} />
          </>
        ) : (
          showPlaceholders && (
            <div className={styles.photoPlaceholder}>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="12" cy="12" r="3.2" />
                <path d="M8 5l1.5-2h5L16 5" />
              </svg>
              Foto do pregador
            </div>
          )
        )}
      </div>
      <img className={styles.background} src={background} alt="" />
      <p
        className={`${styles.title} ${hasTitle ? '' : styles.placeholder}`}
      >
        {hasTitle ? title : showPlaceholders ? 'Título da mensagem' : ''}
      </p>
      <p
        className={`${styles.preacher} ${hasPreacher ? '' : styles.placeholder}`}
      >
        {hasPreacher ? preacher : showPlaceholders ? 'Nome do pregador' : ''}
      </p>
    </div>
  )
}
