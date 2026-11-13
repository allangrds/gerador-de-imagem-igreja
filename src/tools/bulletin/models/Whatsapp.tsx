import { TextAreaField, TextField } from '../../../components/Field'
import { defineModel } from '../../../components/page-builder/types'
import type {
  FormProps,
  ModelProps,
} from '../../../components/page-builder/types'
import { titleSize } from '../../../lib/format'
import type { WhatsappData } from '../types'
import { ArrowIcon } from './ArrowIcon'
import page from './Page.module.css'
import { Sheet } from './Sheet'
import { Qr } from './Qr'
import styles from './Whatsapp.module.css'

function Preview({ data }: ModelProps<WhatsappData>) {
  return (
    <Sheet className={styles.page}>
      <span className={styles.icon}>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.2A8.5 8.5 0 1 1 20 11.5z" />
          <path d="M8.5 10h7" />
          <path d="M8.5 13.5h4.5" />
        </svg>
      </span>
      <div className={styles.heading}>
        <span className={page.kicker}>WhatsApp</span>
        <h1
          className={page.title}
          style={{ fontSize: `${titleSize(data.title, 11)}cqw` }}
        >
          {data.title}
        </h1>
        <p className={page.text}>{data.text}</p>
      </div>
      <span className={page.button}>
        {data.button}
        <ArrowIcon />
      </span>
      {data.link && (
        <div className={styles.qrRow}>
          <span className={styles.qrFrame}>
            <Qr
              text={data.link}
              label="QR Code do grupo"
              className={styles.qr}
            />
          </span>
          <span className={styles.qrText}>
            Ou aponte a câmera do celular para o código.
          </span>
        </div>
      )}
    </Sheet>
  )
}

function Form({ data, onChange }: FormProps<WhatsappData>) {
  return (
    <>
      <TextField
        label="Título"
        value={data.title}
        maxLength={40}
        onChange={(event) => onChange({ title: event.target.value })}
      />
      <TextAreaField
        label="Texto"
        rows={3}
        maxLength={160}
        value={data.text}
        onChange={(event) => onChange({ text: event.target.value })}
      />
      <TextField
        label="Texto do botão"
        value={data.button}
        onChange={(event) => onChange({ button: event.target.value })}
      />
      <TextField
        label="Link de convite do grupo"
        hint="No WhatsApp: dados do grupo › Convidar via link › Copiar link."
        type="url"
        inputMode="url"
        placeholder="https://chat.whatsapp.com/…"
        value={data.link}
        onChange={(event) => onChange({ link: event.target.value })}
      />
    </>
  )
}

export const whatsapp = defineModel<WhatsappData>({
  type: 'whatsapp',
  name: 'Grupo do WhatsApp',
  description: 'Convite com botão e QR Code',
  persisted: true,
  defaults: () => ({
    title: 'Entre no grupo da igreja',
    text: 'Avisos, lembretes da programação e pedidos de oração direto no seu celular.',
    button: 'Entrar no grupo',
    link: '',
  }),
  summary: (data) => data.link || 'Sem link do grupo',
  Preview,
  Form,
})
