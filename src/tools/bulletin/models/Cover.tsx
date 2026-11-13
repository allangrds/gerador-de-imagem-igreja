import { TextField } from '../../../components/Field'
import { ImageField } from '../../../components/page-builder/ImageField'
import { defineModel } from '../../../components/page-builder/types'
import type {
  FormProps,
  ModelProps,
} from '../../../components/page-builder/types'
import { monthAndYear, titleSize } from '../format'
import { CHURCH_NAME } from '../types'
import type { CoverData } from '../types'
import styles from './Cover.module.css'
import page from './Page.module.css'

function Preview({ data }: ModelProps<CoverData>) {
  return (
    <div className={page.page}>
      {data.image && <img className={page.photo} src={data.image.src} alt="" />}
      <div className={styles.shade} />
      <div className={styles.heading}>
        <span className={page.kicker}>{CHURCH_NAME}</span>
        <h1
          className={`${page.title} ${styles.title}`}
          style={{ fontSize: `${titleSize(data.title, 14)}cqw` }}
        >
          {data.title}
        </h1>
      </div>
      {data.subtitle && <p className={styles.subtitle}>{data.subtitle}</p>}
    </div>
  )
}

function Form({ data, onChange }: FormProps<CoverData>) {
  return (
    <>
      <TextField
        label="Título"
        value={data.title}
        maxLength={40}
        onChange={(event) => onChange({ title: event.target.value })}
      />
      <TextField
        label="Subtítulo"
        hint="Aparece na faixa dourada."
        value={data.subtitle}
        onChange={(event) => onChange({ subtitle: event.target.value })}
      />
      <ImageField
        label="Foto de fundo"
        hint="A foto é escurecida embaixo para o título ficar legível."
        value={data.image}
        onChange={(image) => onChange({ image })}
      />
    </>
  )
}

export const cover = defineModel<CoverData>({
  type: 'cover',
  name: 'Capa',
  description: 'Título, mês e foto de fundo',
  persisted: true,
  defaults: () => ({
    title: 'Boletim informativo',
    subtitle: monthAndYear(new Date()),
    image: null,
  }),
  summary: (data) => data.title,
  Preview,
  Form,
})
