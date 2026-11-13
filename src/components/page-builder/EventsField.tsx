import { Button } from '../Button'
import { TextAreaField, TextField } from '../Field'
import { Icon } from '../Icon'
import styles from './EventsField.module.css'

export type ListedEvent = {
  date: string
  hour: string
  minute: string
  name: string
  description: string
}

export const emptyEvent: ListedEvent = {
  date: '',
  hour: '',
  minute: '',
  name: '',
  description: '',
}

// Keeps what was typed in range, so the art never shows "99h".
function twoDigits(value: string, max: number) {
  const digits = value.replace(/\D/g, '').slice(0, 2)

  return digits && String(Math.min(Number(digits), max))
}

type EventsFieldProps = {
  events: ListedEvent[]
  limit: number
  // A one-line description for arts with little room.
  shortDescription?: boolean
  onChange: (events: ListedEvent[]) => void
}

export function EventsField({
  events,
  limit,
  shortDescription,
  onChange,
}: EventsFieldProps) {
  const setEvent = (index: number, patch: Partial<ListedEvent>) =>
    onChange(
      events.map((event, current) =>
        current === index ? { ...event, ...patch } : event
      )
    )

  return (
    <>
      {events.map((event, index) => (
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
              label="Hora"
              type="number"
              inputMode="numeric"
              min={0}
              max={23}
              placeholder="19"
              value={event.hour}
              onChange={(input) =>
                setEvent(index, { hour: twoDigits(input.target.value, 23) })
              }
            />
            <TextField
              label="Minuto"
              type="number"
              inputMode="numeric"
              min={0}
              max={59}
              step={5}
              placeholder="00"
              value={event.minute}
              onChange={(input) =>
                setEvent(index, { minute: twoDigits(input.target.value, 59) })
              }
            />
          </div>
          <TextField
            label="Nome do evento"
            value={event.name}
            onChange={(input) => setEvent(index, { name: input.target.value })}
          />
          {shortDescription ? (
            <TextField
              label="Descrição curta"
              hint="Uma linha. Textos maiores são cortados na imagem."
              maxLength={50}
              value={event.description}
              onChange={(input) =>
                setEvent(index, { description: input.target.value })
              }
            />
          ) : (
            <TextAreaField
              label="Descrição"
              rows={2}
              maxLength={110}
              value={event.description}
              onChange={(input) =>
                setEvent(index, { description: input.target.value })
              }
            />
          )}
          <Button
            variant="ghost"
            onClick={() =>
              onChange(events.filter((_, current) => current !== index))
            }
          >
            <Icon name="trash" size={16} />
            Remover evento {index + 1}
          </Button>
        </fieldset>
      ))}
      <Button
        variant="secondary"
        disabled={events.length >= limit}
        onClick={() => onChange([...events, emptyEvent])}
      >
        <Icon name="plus" size={16} />
        Adicionar evento
      </Button>
    </>
  )
}
