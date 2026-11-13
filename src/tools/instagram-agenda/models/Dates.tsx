import { TextField } from '../../../components/Field'
import {
  EventsField,
  emptyEvent,
} from '../../../components/page-builder/EventsField'
import { defineModel } from '../../../components/page-builder/types'
import type {
  FormProps,
  ModelProps,
} from '../../../components/page-builder/types'
import { joinParts, monthName } from '../../../lib/format'
import { ArtCanvas } from '../art/ArtCanvas'
import { DATES_LIMIT } from '../types'
import type { DatesData } from '../types'
import styles from './Dates.module.css'

function Preview({ data }: ModelProps<DatesData>) {
  return <ArtCanvas type="dates" data={data} />
}

function Form({ data, onChange }: FormProps<DatesData>) {
  return (
    <>
      <TextField
        label="Título da imagem"
        hint="Normalmente o mês, mas pode ser “Esta semana” ou “Dezembro e janeiro”."
        value={data.title}
        onChange={(event) => onChange({ title: event.target.value })}
      />
      <p className={styles.hint}>
        Cabem {DATES_LIMIT} eventos por imagem. Para mais datas, adicione outra
        imagem de Datas.
      </p>
      <EventsField
        events={data.events}
        limit={DATES_LIMIT}
        shortDescription
        onChange={(events) => onChange({ events })}
      />
    </>
  )
}

export const dates = defineModel<DatesData>({
  type: 'dates',
  name: 'Datas',
  description: 'Até 4 eventos com data e horário',
  defaults: () => ({ title: monthName(new Date()), events: [emptyEvent] }),
  sample: () => ({
    title: 'Novembro',
    events: [
      {
        date: '2026-11-14',
        hour: '17',
        minute: '',
        name: 'Sábado jovem',
        description: 'Programa especial preparado pelos jovens.',
      },
      {
        date: '2026-11-18',
        hour: '19',
        minute: '30',
        name: 'Culto de oração',
        description: 'Traga seus pedidos de oração.',
      },
      {
        date: '2026-11-21',
        hour: '9',
        minute: '',
        name: 'Retiro de casais',
        description: 'Inscrições na secretaria.',
      },
      {
        date: '2026-11-28',
        hour: '11',
        minute: '',
        name: 'Ação de graças',
        description: 'Traga um alimento não perecível.',
      },
    ],
  }),
  summary: (data) =>
    joinParts([
      data.title,
      data.events.length === 1 ? '1 evento' : `${data.events.length} eventos`,
    ]),
  Preview,
  Form,
})
