import { AUTHOR_URL, REPOSITORY_URL } from '../lib/links'
import styles from './Footer.module.css'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.church}>
          <Logo />
          <address className={styles.address}>
            <strong>Comunidade Adventista do Belém</strong>
            <span className={styles.muted}>
              Rua Martim Affonso, 152 · Belenzinho · São Paulo – SP
            </span>
          </address>
        </div>
        <div className={styles.links}>
          <span className={styles.muted}>
            Feito com{' '}
            <span role="img" aria-label="amor">
              ❤️
            </span>{' '}
            por <a href={AUTHOR_URL}>Allan Ramos</a>
          </span>
          <a href={REPOSITORY_URL}>Código no GitHub</a>
        </div>
      </div>
    </footer>
  )
}
