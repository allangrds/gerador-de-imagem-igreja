import { useEffect, useEffectEvent, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../Button'
import { Icon } from '../Icon'
import styles from './PreviewDialog.module.css'
import type { PageModel } from './types'

type PreviewDialogProps = {
  model: PageModel
  aspectRatio: string
  canAdd: boolean
  onAdd: () => void
  onClose: () => void
}

export function PreviewDialog({
  model,
  aspectRatio,
  canAdd,
  onAdd,
  onClose,
}: PreviewDialogProps) {
  const titleId = useId()
  const closeButton = useRef<HTMLButtonElement>(null)
  const close = useEffectEvent(onClose)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeButton.current?.focus()

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('keydown', handleKey)
      opener?.focus()
    }
  }, [])

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.head}>
          <div>
            <h2 id={titleId} className={styles.title}>
              {model.name}
            </h2>
            <p className={styles.description}>{model.description}</p>
          </div>
          <button
            ref={closeButton}
            type="button"
            className={styles.close}
            aria-label="Fechar"
            onClick={onClose}
          >
            <Icon name="close" size={22} />
          </button>
        </div>
        <div className={styles.stage}>
          <div
            className={styles.frame}
            style={{ width: `min(100%, calc(62dvh * (${aspectRatio})))` }}
          >
            <model.Preview data={(model.sample ?? model.defaults)()} />
          </div>
        </div>
        <p className={styles.note}>Exemplo com textos de amostra.</p>
        <Button large block disabled={!canAdd} onClick={onAdd}>
          <Icon name="plus" />
          Adicionar “{model.name}”
        </Button>
      </div>
    </div>,
    document.body
  )
}
