import type { ListedEvent } from '../../components/page-builder/EventsField'
import type { Photo } from '../../lib/image'

export type AgendaCoverData = {
  title: string
  subtitle: string
  image: Photo | null
}

export type DatesData = {
  title: string
  events: ListedEvent[]
}

export type AgendaClosingData = {
  logo: Photo | null
}

export const DATES_LIMIT = 4
export const CAROUSEL_LIMIT = 20
