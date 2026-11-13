import styles from './Toast.module.css'
import { Icon } from './Icon'

type ToastProps = {
  message: string
  detail?: string
}

export function Toast({ message, detail }: ToastProps) {
  return (
    <div role="status" className={styles.toast}>
      <span className={styles.badge}>
        <Icon name="check" />
      </span>
      <span className={styles.text}>
        <strong>{message}</strong>
        {detail && <span className={styles.detail}>{detail}</span>}
      </span>
    </div>
  )
}
