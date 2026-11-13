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
  sortByDate,
  titleSize,
  weekday,
} from '../../../lib/format'
import { CALENDAR_LIMIT } from '../types'
import type { CalendarData } from '../types'
import styles from './Calendar.module.css'
import page from './Page.module.css'
import { Sheet } from './Sheet'

function Preview({ data }: ModelProps<CalendarData>) {
  return (
    <Sheet className={`${page.light} ${styles.page}`}>
      <div className={styles.heading}>
        <span className={page.kicker}>Agenda</span>
        <h1
          className={page.title}
          style={{ fontSize: `${titleSize(data.title, 11)}cqw` }}
        >
          {data.title}
        </h1>
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

function Form({ data, onChange }: FormProps<CalendarData>) {
  return (
    <>
      <TextField
        label="Título da página"
        value={data.title}
        onChange={(event) => onChange({ title: event.target.value })}
      />
      <p className={styles.hint}>
        Os eventos saem em ordem de data, mesmo que sejam de meses diferentes.
        Cabem até {CALENDAR_LIMIT} por página.
      </p>
      <EventsField
        events={data.events}
        limit={CALENDAR_LIMIT}
        onChange={(events) => onChange({ events })}
      />
    </>
  )
}

export const calendar = defineModel<CalendarData>({
  type: 'calendar',
  name: 'Calendário',
  description: 'Lista de eventos com data e descrição',
  defaults: () => ({ title: 'Próximos eventos', events: [emptyEvent] }),
  sample: () => ({
    title: 'Próximos eventos',
    events: [
      {
        date: '2026-11-21',
        hour: '9',
        minute: '',
        name: 'Retiro de casais',
        description:
          'Palestras, almoço e momentos a dois. Inscrições na secretaria.',
      },
      {
        date: '2026-11-28',
        hour: '11',
        minute: '',
        name: 'Culto de ação de graças',
        description: 'Traga um alimento não perecível para doação.',
      },
      {
        date: '2026-12-19',
        hour: '19',
        minute: '30',
        name: 'Cantata de Natal',
        description: 'Apresentação do coral e dos jovens. Convide um amigo.',
      },
    ],
  }),
  summary: (data) =>
    data.events.length === 1 ? '1 evento' : `${data.events.length} eventos`,
  Preview,
  Form,
})
