import { TextAreaField, TextField } from '../../../components/Field'
import { ImageField } from '../../../components/page-builder/ImageField'
import { defineModel } from '../../../components/page-builder/types'
import type {
  FormProps,
  ModelProps,
} from '../../../components/page-builder/types'
import { joinParts, longDate, titleSize } from '../../../lib/format'
import type { EventData } from '../types'
import styles from './Event.module.css'
import page from './Page.module.css'
import { Sheet } from './Sheet'

function Preview({ data }: ModelProps<EventData>) {
  const when = joinParts([longDate(data.date), data.time])

  return (
    <Sheet>
      <div className={styles.photo}>
        {data.image && (
          <img className={page.photo} src={data.image.src} alt="" />
        )}
        <div className={styles.fade} />
        <span className={styles.tag}>Evento</span>
      </div>
      <div className={styles.body}>
        <h1
          className={page.title}
          style={{ fontSize: `${titleSize(data.name, 11)}cqw` }}
        >
          {data.name}
        </h1>
        {when && (
          <div className={styles.when}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 10h18" />
              <path d="M8 3v4" />
              <path d="M16 3v4" />
            </svg>
            <span>{when}</span>
          </div>
        )}
        <p className={page.text}>{data.description}</p>
        <div className={styles.price}>
          <span className={styles.priceLabel}>Valor</span>
          <span className={styles.priceValue}>{data.price || 'Gratuito'}</span>
        </div>
      </div>
    </Sheet>
  )
}

function Form({ data, onChange }: FormProps<EventData>) {
  return (
    <>
      <TextField
        label="Nome do evento"
        value={data.name}
        maxLength={40}
        onChange={(event) => onChange({ name: event.target.value })}
      />
      <div className={styles.row}>
        <TextField
          label="Data"
          type="date"
          value={data.date}
          onChange={(event) => onChange({ date: event.target.value })}
        />
        <TextField
          label="Horário"
          placeholder="9h às 17h"
          value={data.time}
          onChange={(event) => onChange({ time: event.target.value })}
        />
      </div>
      <TextAreaField
        label="Descrição"
        rows={5}
        maxLength={280}
        value={data.description}
        onChange={(event) => onChange({ description: event.target.value })}
      />
      <TextField
        label="Valor"
        hint="Deixe em branco para mostrar “Gratuito”."
        value={data.price}
        onChange={(event) => onChange({ price: event.target.value })}
      />
      <ImageField
        label="Foto do evento"
        value={data.image}
        onChange={(image) => onChange({ image })}
      />
    </>
  )
}

export const event = defineModel<EventData>({
  type: 'event',
  name: 'Evento',
  description: 'Destaque com foto, data e valor',
  defaults: () => ({
    name: 'Retiro de casais',
    date: '',
    time: '9h às 17h',
    description:
      'Um dia inteiro para cuidar do casamento, com palestras, almoço e momentos a dois. Vagas limitadas: inscreva-se na secretaria.',
    price: 'R$ 120 por casal',
    image: null,
  }),
  summary: (data) => joinParts([data.name, longDate(data.date)]),
  Preview,
  Form,
})
