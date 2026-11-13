import { TextAreaField, TextField } from '../../../components/Field'
import { defineModel } from '../../../components/page-builder/types'
import type {
  FormProps,
  ModelProps,
} from '../../../components/page-builder/types'
import { titleSize } from '../../../lib/format'
import type { NoticeData } from '../types'
import styles from './Notice.module.css'
import page from './Page.module.css'
import { Sheet } from './Sheet'
import { CHURCH_NAME } from '../../../lib/church'

function Preview({ data }: ModelProps<NoticeData>) {
  return (
    <Sheet className={page.light}>
      <span className={styles.tag}>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z" />
          <path d="M17 9a4 4 0 0 1 0 6" />
        </svg>
        Comunicado
      </span>
      <div className={styles.body}>
        <h1
          className={`${page.title} ${styles.title}`}
          style={{ fontSize: `${titleSize(data.title, 9.4)}cqw` }}
        >
          {data.title}
        </h1>
        <span className={styles.rule} />
        <p className={`${page.text} ${styles.text}`}>{data.text}</p>
      </div>
      <div className={styles.signature}>
        <strong>{data.signature}</strong>
        <span>{CHURCH_NAME}</span>
      </div>
    </Sheet>
  )
}

function Form({ data, onChange }: FormProps<NoticeData>) {
  return (
    <>
      <TextField
        label="Título"
        value={data.title}
        maxLength={60}
        onChange={(event) => onChange({ title: event.target.value })}
      />
      <TextAreaField
        label="Texto"
        hint="Deixe uma linha em branco entre os parágrafos."
        rows={8}
        value={data.text}
        maxLength={600}
        onChange={(event) => onChange({ text: event.target.value })}
      />
      <TextField
        label="Assinatura"
        value={data.signature}
        onChange={(event) => onChange({ signature: event.target.value })}
      />
    </>
  )
}

export const notice = defineModel<NoticeData>({
  type: 'notice',
  name: 'Comunicado',
  description: 'Aviso em texto com assinatura',
  defaults: () => ({
    title: 'Novo horário do culto de quarta',
    text: 'A partir de 2 de dezembro, o culto de oração de quarta-feira começa às 19h30, meia hora mais cedo.\n\nA mudança atende ao pedido das famílias com crianças pequenas. A Escola Sabatina e o culto de sábado continuam no mesmo horário.\n\nDúvidas? Fale com a secretaria depois do culto.',
    signature: 'Diretoria da igreja',
  }),
  summary: (data) => data.title,
  Preview,
  Form,
})
