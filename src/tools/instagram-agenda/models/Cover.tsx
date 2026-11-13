import { TextField } from '../../../components/Field'
import { ImageField } from '../../../components/page-builder/ImageField'
import { defineModel } from '../../../components/page-builder/types'
import type {
  FormProps,
  ModelProps,
} from '../../../components/page-builder/types'
import { monthName, titleSize } from '../../../lib/format'
import type { AgendaCoverData } from '../types'
import styles from './Cover.module.css'
import page from './Page.module.css'
import { Sheet } from './Sheet'
import { CHURCH_NAME } from '../../../lib/church'

function Preview({ data }: ModelProps<AgendaCoverData>) {
  return (
    <Sheet>
      {data.image && <img className={page.photo} src={data.image.src} alt="" />}
      <div className={styles.shade} />
      <div className={styles.heading}>
        <span className={page.kicker}>{CHURCH_NAME}</span>
        <h1
          className={`${page.title} ${styles.title}`}
          style={{ fontSize: `${titleSize(data.title, 17)}cqw` }}
        >
          {data.title}
        </h1>
      </div>
      {data.subtitle && <p className={styles.subtitle}>{data.subtitle}</p>}
      <span className={styles.swipe}>
        Arraste
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </span>
    </Sheet>
  )
}

function Form({ data, onChange }: FormProps<AgendaCoverData>) {
  return (
    <>
      <TextField
        label="Título"
        value={data.title}
        maxLength={24}
        onChange={(event) => onChange({ title: event.target.value })}
      />
      <TextField
        label="Subtítulo"
        hint="Aparece na faixa dourada. Bom lugar para o período da agenda."
        value={data.subtitle}
        onChange={(event) => onChange({ subtitle: event.target.value })}
      />
      <ImageField
        label="Imagem de fundo"
        hint="A foto é escurecida embaixo para o título ficar legível."
        value={data.image}
        onChange={(image) => onChange({ image })}
      />
    </>
  )
}

export const cover = defineModel<AgendaCoverData>({
  type: 'cover',
  name: 'Capa',
  description: 'Primeira imagem do carrossel',
  persisted: true,
  defaults: () => ({
    title: 'Agenda',
    subtitle: monthName(new Date()),
    image: null,
  }),
  summary: (data) => data.title,
  Preview,
  Form,
})
