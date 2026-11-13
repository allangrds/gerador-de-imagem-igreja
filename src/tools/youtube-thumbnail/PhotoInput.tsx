import { useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { Button } from '../../components/Button'
import { TextField } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { Segmented } from '../../components/Segmented'
import styles from './PhotoInput.module.css'
import type { Photo } from '../../lib/image'
import type { PhotoSource } from './useThumbnailForm'

type PhotoInputProps = {
  source: PhotoSource
  url: string
  photo: Photo | null
  error: string | null
  onSourceChange: (source: PhotoSource) => void
  onUrlChange: (url: string) => void
  onUrlSubmit: (url: string) => void
  onFile: (file: File) => void
  onRemove: () => void
}

export function PhotoInput({
  source,
  url,
  photo,
  error,
  onSourceChange,
  onUrlChange,
  onUrlSubmit,
  onFile,
  onRemove,
}: PhotoInputProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const chooseFile = () => fileInput.current?.click()

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setDragging(false)

    const file = event.dataTransfer.files[0]

    if (file) {
      onFile(file)
    }
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Foto do pregador</legend>
      <Segmented
        label="Origem da foto"
        value={source}
        onChange={onSourceChange}
        options={[
          { value: 'file', label: 'Enviar arquivo' },
          { value: 'url', label: 'Colar link' },
        ]}
      />

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="visually-hidden"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const file = event.target.files?.[0]

          if (file) {
            onFile(file)
          }

          event.target.value = ''
        }}
      />

      {source === 'file' && !photo && (
        <button
          type="button"
          className={`${styles.dropzone} ${dragging ? styles.dragging : ''}`}
          onClick={chooseFile}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <Icon name={dragging ? 'download' : 'upload'} size={28} />
          <span className={styles.dropTitle}>
            {dragging
              ? 'Solte para usar esta foto'
              : 'Arraste a foto aqui ou clique para escolher'}
          </span>
          {!dragging && (
            <span className={styles.dropHint}>
              JPG ou PNG · de preferência na horizontal
            </span>
          )}
        </button>
      )}

      {source === 'url' && (
        <form
          className={styles.urlForm}
          onSubmit={(event) => {
            event.preventDefault()
            onUrlSubmit(url)
          }}
        >
          <TextField
            label="Link da imagem"
            type="url"
            inputMode="url"
            placeholder="https://…"
            value={url}
            error={error ?? undefined}
            onChange={(event) => onUrlChange(event.target.value)}
            onBlur={() => onUrlSubmit(url)}
          />
          {!photo && (
            <Button type="submit" variant="secondary">
              Carregar imagem
            </Button>
          )}
        </form>
      )}

      {source === 'file' && error && (
        <span role="alert" className={styles.error}>
          <Icon name="alert" />
          {error}
        </span>
      )}

      {photo && (
        <div className={styles.chip}>
          <img className={styles.chipImage} src={photo.src} alt="" />
          <span className={styles.chipText}>
            <span className={styles.chipName}>{photo.name}</span>
            <span className={styles.chipDetail}>{photo.detail}</span>
          </span>
          {source === 'file' && (
            <button
              type="button"
              className={styles.smallButton}
              onClick={chooseFile}
            >
              Trocar
            </button>
          )}
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Remover foto"
            onClick={onRemove}
          >
            <Icon name="trash" />
          </button>
        </div>
      )}
    </fieldset>
  )
}
