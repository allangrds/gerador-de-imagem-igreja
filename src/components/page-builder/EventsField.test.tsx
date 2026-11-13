import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EventsField, emptyEvent } from './EventsField'

const retiro = { ...emptyEvent, name: 'Retiro', date: '2026-11-21' }

describe('EventsField', () => {
  it('edits one event and keeps the others', () => {
    const onChange = vi.fn()
    render(
      <EventsField
        events={[retiro, emptyEvent]}
        limit={4}
        onChange={onChange}
      />
    )

    fireEvent.change(screen.getAllByLabelText('Nome do evento')[1], {
      target: { value: 'Batismo' },
    })

    expect(onChange).toHaveBeenCalledWith([
      retiro,
      { ...emptyEvent, name: 'Batismo' },
    ])
  })

  it('adds and removes events', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<EventsField events={[retiro]} limit={4} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Adicionar evento' }))
    expect(onChange).toHaveBeenLastCalledWith([retiro, emptyEvent])

    await user.click(screen.getByRole('button', { name: 'Remover evento 1' }))
    expect(onChange).toHaveBeenLastCalledWith([])
  })

  it('takes the time as hour and minute numbers', () => {
    const onChange = vi.fn()
    render(<EventsField events={[retiro]} limit={4} onChange={onChange} />)

    fireEvent.change(screen.getByLabelText('Hora'), {
      target: { value: '19' },
    })
    expect(onChange).toHaveBeenLastCalledWith([{ ...retiro, hour: '19' }])

    fireEvent.change(screen.getByLabelText('Minuto'), {
      target: { value: '30' },
    })
    expect(onChange).toHaveBeenLastCalledWith([{ ...retiro, minute: '30' }])
    expect(screen.getByLabelText('Hora')).toHaveAttribute('type', 'number')
  })

  it('stops adding at the limit', () => {
    render(
      <EventsField events={[retiro, retiro]} limit={2} onChange={vi.fn()} />
    )

    expect(
      screen.getByRole('button', { name: 'Adicionar evento' })
    ).toBeDisabled()
  })

  it('uses a one-line description when the art has little room', () => {
    render(
      <EventsField
        events={[retiro]}
        limit={4}
        shortDescription
        onChange={vi.fn()}
      />
    )

    expect(screen.getByLabelText('Descrição curta').tagName).toBe('INPUT')
  })
})
