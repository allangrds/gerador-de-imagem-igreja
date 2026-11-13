import type { ListedEvent } from '../../components/page-builder/EventsField'
import type { Photo } from '../../lib/image'

export type CoverData = {
  title: string
  subtitle: string
  image: Photo | null
}

export type CalendarData = {
  title: string
  events: ListedEvent[]
}

export type EventData = {
  name: string
  date: string
  time: string
  description: string
  price: string
  image: Photo | null
}

export type ImageData = {
  image: Photo | null
  fit: 'cover' | 'contain'
  link: string
}

export type NoticeData = {
  title: string
  text: string
  signature: string
}

export type PhotosData = {
  title: string
  text: string
  button: string
  link: string
  images: Photo[]
}

export type OfferingsData = {
  title: string
  verse: string
  reference: string
  keyType: string
  pixKey: string
  beneficiary: string
  city: string
  bank: string
  agency: string
  account: string
  note: string
}

export type WhatsappData = {
  title: string
  text: string
  button: string
  link: string
}

export type ClosingData = {
  logo: Photo | null
  message: string
  address: string
  instagram: string
  youtube: string
  facebook: string
  site: string
}

export const CHURCH_NAME = 'Comunidade Adventista do Belém'
export const CALENDAR_LIMIT = 4
export const PHOTOS_LIMIT = 3
export const PIX_KEY_TYPES = ['CNPJ', 'CPF', 'E-mail', 'Telefone', 'Aleatória']
