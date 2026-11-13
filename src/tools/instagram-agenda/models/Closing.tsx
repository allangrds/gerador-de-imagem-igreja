import defaultLogo from '../../../assets/logo-iasd-belem-vertical-preto.png'
import { ImageField } from '../../../components/page-builder/ImageField'
import { defineModel } from '../../../components/page-builder/types'
import type {
  FormProps,
  ModelProps,
} from '../../../components/page-builder/types'
import type { AgendaClosingData } from '../types'
import styles from './Closing.module.css'
import page from './Page.module.css'
import { Sheet } from './Sheet'
import { CHURCH_LOGO_ALT } from '../../../lib/church'

function Preview({ data }: ModelProps<AgendaClosingData>) {
  return (
    <Sheet className={page.light}>
      <div className={styles.body}>
        <img
          className={styles.logo}
          src={data.logo?.src ?? defaultLogo}
          alt={CHURCH_LOGO_ALT}
        />
        <div className={styles.actions}>
          <span className={styles.action}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 3h12v18l-6-4-6 4z" />
            </svg>
            Salve a agenda
          </span>
          <span className={styles.action}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 3L10 14" />
              <path d="M21 3l-7 18-4-7-7-4z" />
            </svg>
            Envie para um amigo
          </span>
        </div>
      </div>
    </Sheet>
  )
}

function Form({ data, onChange }: FormProps<AgendaClosingData>) {
  return (
    <ImageField
      label="Logo da igreja"
      hint="Sem imagem, usa o logo da igreja."
      value={data.logo}
      onChange={(logo) => onChange({ logo })}
    />
  )
}

export const closing = defineModel<AgendaClosingData>({
  type: 'closing',
  name: 'Final',
  description: 'Logo e convite para salvar e compartilhar',
  persisted: true,
  defaults: () => ({
    logo: null,
  }),
  summary: (data) => (data.logo ? data.logo.name : 'Logo da igreja'),
  Preview,
  Form,
})
