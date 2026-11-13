import logo from '../assets/comunidade-belem.png'
import styles from './Logo.module.css'

export function Logo({ alt = '' }: { alt?: string }) {
  return (
    <span className={styles.tile}>
      <img src={logo} alt={alt} />
    </span>
  )
}
