import { useRef, useState } from 'react'
import { readImageFile } from '../../lib/image'
import type { Photo } from '../../lib/image'
import { Icon } from '../Icon'
import styles from './ImageField.module.css'

type ImageFieldProps = {
  label: string
  hint?: string
  value: Photo | null
  onChange: (photo: Photo | null) => void
}

export function ImageField({ label, hint, value, onChange }: ImageFieldProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [error, setError] = useState(false)

  const chooseFile = () => fileInput.current?.click()

  async function handleFile(file: File) {
    try {
      onChange(await readImageFile(file))
      setError(false)
    } catch {
      setError(true)
    }
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{label}</legend>
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
            handleFile(file)
          }

          event.target.value = ''
        }}
      />

      {value ? (
        <div className={styles.chip}>
          <img className={styles.chipImage} src={value.src} alt="" />
          <span className={styles.chipText}>
            <span className={styles.chipName}>{value.name}</span>
            <span className={styles.chipDetail}>{value.detail}</span>
          </span>
          <button
            type="button"
            className={styles.smallButton}
            onClick={chooseFile}
          >
            Trocar
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={`Remover ${label}`}
            onClick={() => onChange(null)}
          >
            <Icon name="trash" />
          </button>
        </div>
      ) : (
        <button type="button" className={styles.dropzone} onClick={chooseFile}>
          <Icon name="upload" size={22} />
          Escolher imagem
        </button>
      )}

      {error && (
        <span role="alert" className={styles.error}>
          <Icon name="alert" />
          Não foi possível ler esta imagem. Tente outra em JPG ou PNG.
        </span>
      )}
      {hint && <span className={styles.hint}>{hint}</span>}
    </fieldset>
  )
}
