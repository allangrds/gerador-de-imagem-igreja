import styles from './Tag.module.css'

type TagProps = {
  tone: 'available' | 'soon'
  children: string
}

export function Tag({ tone, children }: TagProps) {
  return <span className={`${styles.tag} ${styles[tone]}`}>{children}</span>
}
