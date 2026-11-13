import logo from '../assets/logo-iasd-belem-horizontal-branco.png'
import styles from './Logo.module.css'

// White version: the header and footer sit on the ink background.
export function Logo({ alt = '' }: { alt?: string }) {
  return <img className={styles.logo} src={logo} alt={alt} />
}
