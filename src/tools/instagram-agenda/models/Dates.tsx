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
import {
  dayAndMonth,
  formatTime,
  joinParts,
  monthName,
  sortByDate,
  titleSize,
  weekday,
} from '../../../lib/format'
import { DATES_LIMIT } from '../types'
import type { DatesData } from '../types'
import styles from './Dates.module.css'
import page from './Page.module.css'
import { Sheet } from './Sheet'

function Preview({ data }: ModelProps<DatesData>) {
  return (
    <Sheet className={`${page.light} ${styles.page}`}>
      <div className={styles.heading}>
        <div className={styles.headingText}>
          <span className={page.kicker}>Agenda</span>
          <h1
            className={page.title}
            style={{ fontSize: `${titleSize(data.title, 10, 64)}cqw` }}
          >
            {data.title}
          </h1>
        </div>
        <span className={styles.rule} />
      </div>
      <ul className={styles.events}>
        {sortByDate(data.events).map((event, index) => {
          const { day, month } = dayAndMonth(event.date)

          return (
            <li key={index} className={styles.event}>
              <span className={styles.date}>
                <span className={styles.day}>{day}</span>
                <span className={styles.month}>{month}</span>
              </span>
              <span className={styles.info}>
                <span className={styles.name}>{event.name}</span>
                <span className={styles.when}>
                  {joinParts([
                    weekday(event.date),
                    formatTime(event.hour, event.minute),
                  ])}
                </span>
                {event.description && (
                  <span className={styles.description}>
                    {event.description}
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ul>
    </Sheet>
  )
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
