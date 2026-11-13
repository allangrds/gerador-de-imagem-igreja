import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { Tag } from '../../components/Tag'
import type { Tool } from '../../tools/registry'
import styles from './ToolCard.module.css'
import { ToolPreview } from './ToolPreview'

export function ToolCard({ tool }: { tool: Tool }) {
  if (tool.status === 'available' && tool.path) {
    return (
      <Link to={tool.path} className={`${styles.card} ${styles.available}`}>
        <ToolPreview id={tool.id} />
        <div className={styles.body}>
          <div className={styles.meta}>
            <Tag tone="available">Disponível</Tag>
            <span>{tool.size}</span>
          </div>
          <h3 className={styles.name}>{tool.name}</h3>
          <p className={styles.description}>{tool.description}</p>
          <span className={styles.cta}>
            Abrir editor
            <Icon name="arrowRight" />
          </span>
        </div>
      </Link>
    )
  }

  return (
    <article className={`${styles.card} ${styles.soon}`}>
      <div className={styles.soonPreview} aria-hidden="true">
        <div
          className={styles.soonFrame}
          style={{ aspectRatio: tool.aspectRatio }}
        >
          {tool.size}
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <Tag tone="soon">Em breve</Tag>
        </div>
        <h3 className={styles.name}>{tool.name}</h3>
        <p className={styles.description}>{tool.description}</p>
      </div>
    </article>
  )
}
