import defaultLogo from '../../../assets/comunidade-belem.png'
import { TextAreaField, TextField } from '../../../components/Field'
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
import { CHURCH_NAME } from '../../../lib/church'

function Preview({ data }: ModelProps<AgendaClosingData>) {
  return (
    <Sheet className={page.light}>
      <div className={styles.body}>
        <img
          className={styles.logo}
          src={data.logo?.src ?? defaultLogo}
          alt=""
        />
        <div className={styles.church}>
          <span className={styles.name}>{CHURCH_NAME}</span>
          {data.address && (
            <span className={styles.address}>{data.address}</span>
          )}
        </div>
        <span className={styles.rule} />
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
      <div className={styles.farewell}>
        <span className={styles.message}>{data.message}</span>
        {data.profile && <span className={styles.profile}>{data.profile}</span>}
      </div>
    </Sheet>
  )
}

function Form({ data, onChange }: FormProps<AgendaClosingData>) {
  return (
    <>
      <ImageField
        label="Logo da igreja"
        hint="Sem imagem, usa o logo da igreja."
        value={data.logo}
        onChange={(logo) => onChange({ logo })}
      />
      <TextField
        label="Mensagem final"
        value={data.message}
        maxLength={24}
        onChange={(event) => onChange({ message: event.target.value })}
      />
      <TextAreaField
        label="Endereço"
        rows={2}
        value={data.address}
        onChange={(event) => onChange({ address: event.target.value })}
      />
      <TextField
        label="Perfil no Instagram"
        placeholder="@perfildaigreja"
        value={data.profile}
        onChange={(event) => onChange({ profile: event.target.value })}
      />
    </>
  )
}

export const closing = defineModel<AgendaClosingData>({
  type: 'closing',
  name: 'Final',
  description: 'Logo, endereço e convite',
  persisted: true,
  defaults: () => ({
    logo: null,
    message: 'Te esperamos!',
    address: 'Rua Martim Affonso, 152 · Belenzinho\nSão Paulo – SP',
    profile: '',
  }),
  summary: (data) => data.message,
  Preview,
  Form,
})
