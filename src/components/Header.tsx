import { Link } from 'react-router'
import { REPOSITORY_URL } from '../lib/links'
import styles from './Header.module.css'
import { Logo } from './Logo'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <Logo alt="Igreja Adventista do Sétimo Dia – Belém" />
          <span className={styles.name}>
            <span className={styles.title}>Gerador para IASD Belém</span>
            <span className={styles.subtitle}>
              Comunidade Adventista do Belém · SP
            </span>
          </span>
        </Link>
        <nav aria-label="Principal" className={styles.nav}>
          <Link to="/#ferramentas">Ferramentas</Link>
          <Link to="/#como-funciona">Como funciona</Link>
          <a href={REPOSITORY_URL}>GitHub</a>
        </nav>
      </div>
    </header>
  )
}
