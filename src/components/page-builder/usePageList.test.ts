import { createPageList, pageListReducer } from './usePageList'

function types(state: ReturnType<typeof createPageList>) {
  return state.pages.map((page) => page.type)
}

const start = () =>
  createPageList([
    { type: 'capa', data: { title: 'Boletim' } },
    { type: 'evento', data: {} },
    { type: 'final', data: {} },
  ])

describe('pageListReducer', () => {
  it('starts with the first page selected and unique ids', () => {
    const state = start()

    expect(state.selected).toBe(0)
    expect(new Set(state.pages.map((page) => page.id)).size).toBe(3)
  })

  it('adds a page at the end and selects it', () => {
    const state = pageListReducer(start(), {
      kind: 'add',
      type: 'comunicado',
      data: {},
    })

    expect(types(state)).toEqual(['capa', 'evento', 'final', 'comunicado'])
    expect(state.selected).toBe(3)
  })

  it('does not add beyond the limit', () => {
    const state = pageListReducer(start(), {
      kind: 'add',
      type: 'comunicado',
      data: {},
      max: 3,
    })

    expect(types(state)).toEqual(['capa', 'evento', 'final'])
  })

  it('moves a page and keeps the selection on it', () => {
    const selected = pageListReducer(start(), { kind: 'select', index: 1 })
    const state = pageListReducer(selected, { kind: 'move', index: 1, by: -1 })

    expect(types(state)).toEqual(['evento', 'capa', 'final'])
    expect(state.selected).toBe(0)
  })

  it('keeps the selection on the same page when another one moves past it', () => {
    const state = pageListReducer(start(), { kind: 'move', index: 1, by: -1 })

    expect(types(state)).toEqual(['evento', 'capa', 'final'])
    expect(state.selected).toBe(1)
  })

  it('ignores moves past the ends', () => {
    const state = start()

    expect(pageListReducer(state, { kind: 'move', index: 0, by: -1 })).toBe(
      state
    )
    expect(pageListReducer(state, { kind: 'move', index: 2, by: 1 })).toBe(
      state
    )
  })

  it('removes a page and keeps a valid selection', () => {
    const last = pageListReducer(start(), { kind: 'select', index: 2 })
    const state = pageListReducer(last, { kind: 'remove', index: 2 })

    expect(types(state)).toEqual(['capa', 'evento'])
    expect(state.selected).toBe(1)
  })

  it('keeps the selected page when an earlier one is removed', () => {
    const selected = pageListReducer(start(), { kind: 'select', index: 2 })
    const state = pageListReducer(selected, { kind: 'remove', index: 0 })

    expect(state.pages[state.selected].type).toBe('final')
  })

  it('duplicates a page right after it with its own id and data copy', () => {
    const state = pageListReducer(start(), { kind: 'duplicate', index: 0 })

    expect(types(state)).toEqual(['capa', 'capa', 'evento', 'final'])
    expect(state.pages[1].id).not.toBe(state.pages[0].id)
    expect(state.pages[1].data).toEqual(state.pages[0].data)
    expect(state.selected).toBe(1)
  })

  it('updates the data of one page', () => {
    const state = pageListReducer(start(), {
      kind: 'update',
      index: 0,
      patch: { title: 'Agenda' },
    })

    expect(state.pages[0].data).toEqual({ title: 'Agenda' })
  })
})
