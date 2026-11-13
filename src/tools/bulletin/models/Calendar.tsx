import { Button } from '../../../components/Button'
import { TextAreaField, TextField } from '../../../components/Field'
import { Icon } from '../../../components/Icon'
import { defineModel } from '../../../components/page-builder/types'
import type {
  FormProps,
  ModelProps,
} from '../../../components/page-builder/types'
import {
  dayAndMonth,
  joinParts,
  sortByDate,
  titleSize,
  weekday,
} from '../format'
import { CALENDAR_LIMIT } from '../types'
import type { CalendarData, CalendarEvent } from '../types'
import styles from './Calendar.module.css'
import page from './Page.module.css'

const emptyEvent: CalendarEvent = {
  date: '',
  time: '',
  name: '',
  description: '',
}

function Preview({ data }: ModelProps<CalendarData>) {
  return (
    <div className={`${page.page} ${page.light} ${styles.page}`}>
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
                  {joinParts([weekday(event.date), event.time])}
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
    </div>
  )
}

function Form({ data, onChange }: FormProps<CalendarData>) {
  const setEvent = (index: number, patch: Partial<CalendarEvent>) =>
    onChange({
      events: data.events.map((event, current) =>
        current === index ? { ...event, ...patch } : event
      ),
    })

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
      {data.events.map((event, index) => (
        <fieldset key={index} className={styles.fieldset}>
          <legend className={styles.legend}>Evento {index + 1}</legend>
          <div className={styles.row}>
            <TextField
              label="Data"
              type="date"
              value={event.date}
              onChange={(input) =>
                setEvent(index, { date: input.target.value })
              }
            />
            <TextField
              label="Horário"
              placeholder="19h"
              value={event.time}
              onChange={(input) =>
                setEvent(index, { time: input.target.value })
              }
            />
          </div>
          <TextField
            label="Nome do evento"
            value={event.name}
            onChange={(input) => setEvent(index, { name: input.target.value })}
          />
          <TextAreaField
            label="Descrição"
            rows={2}
            maxLength={110}
            value={event.description}
            onChange={(input) =>
              setEvent(index, { description: input.target.value })
            }
          />
          <Button
            variant="ghost"
            onClick={() =>
              onChange({
                events: data.events.filter((_, current) => current !== index),
              })
            }
          >
            <Icon name="trash" size={16} />
            Remover evento {index + 1}
          </Button>
        </fieldset>
      ))}
      <Button
        variant="secondary"
        disabled={data.events.length >= CALENDAR_LIMIT}
        onClick={() => onChange({ events: [...data.events, emptyEvent] })}
      >
        <Icon name="plus" size={16} />
        Adicionar evento
      </Button>
    </>
  )
}

export const calendar = defineModel<CalendarData>({
  type: 'calendar',
  name: 'Calendário',
  description: 'Lista de eventos com data e descrição',
  defaults: () => ({ title: 'Próximos eventos', events: [emptyEvent] }),
  summary: (data) =>
    data.events.length === 1 ? '1 evento' : `${data.events.length} eventos`,
  Preview,
  Form,
})
