import { useReducer } from 'react'

export type PageData = Record<string, unknown>

export type Page = {
  id: number
  type: string
  data: PageData
}

export type PageList = {
  pages: Page[]
  selected: number
  nextId: number
}

export type PageListAction =
  | { kind: 'add'; type: string; data: PageData; max?: number }
  | { kind: 'move'; index: number; by: -1 | 1 }
  | { kind: 'remove'; index: number }
  | { kind: 'duplicate'; index: number; max?: number }
  | { kind: 'select'; index: number }
  | { kind: 'update'; index: number; patch: PageData }

export function createPageList(
  initial: { type: string; data: PageData }[]
): PageList {
  return {
    pages: initial.map((page, index) => ({ ...page, id: index + 1 })),
    selected: 0,
    nextId: initial.length + 1,
  }
}

function withinLimit(state: PageList, max?: number) {
  return max === undefined || state.pages.length < max
}

export function pageListReducer(
  state: PageList,
  action: PageListAction
): PageList {
  switch (action.kind) {
    case 'add': {
      if (!withinLimit(state, action.max)) {
        return state
      }

      const page = { id: state.nextId, type: action.type, data: action.data }

      return {
        pages: [...state.pages, page],
        selected: state.pages.length,
        nextId: state.nextId + 1,
      }
    }

    case 'move': {
      const target = action.index + action.by

      if (target < 0 || target >= state.pages.length) {
        return state
      }

      const pages = [...state.pages]
      ;[pages[action.index], pages[target]] = [
        pages[target],
        pages[action.index],
      ]
      const { selected } = state

      return {
        ...state,
        pages,
        selected:
          selected === action.index
            ? target
            : selected === target
              ? action.index
              : selected,
      }
    }

    case 'remove': {
      const pages = state.pages.filter((_, index) => index !== action.index)
      const selected =
        state.selected > action.index ? state.selected - 1 : state.selected

      return {
        ...state,
        pages,
        selected: Math.max(0, Math.min(selected, pages.length - 1)),
      }
    }

    case 'duplicate': {
      const source = state.pages[action.index]

      if (!source || !withinLimit(state, action.max)) {
        return state
      }

      const pages = [...state.pages]
      pages.splice(action.index + 1, 0, {
        ...source,
        id: state.nextId,
        data: structuredClone(source.data),
      })

      return { pages, selected: action.index + 1, nextId: state.nextId + 1 }
    }

    case 'select':
      return { ...state, selected: action.index }

    case 'update':
      return {
        ...state,
        pages: state.pages.map((page, index) =>
          index === action.index
            ? { ...page, data: { ...page.data, ...action.patch } }
            : page
        ),
      }
  }
}

export function usePageList(initial: { type: string; data: PageData }[]) {
  return useReducer(pageListReducer, initial, createPageList)
}
