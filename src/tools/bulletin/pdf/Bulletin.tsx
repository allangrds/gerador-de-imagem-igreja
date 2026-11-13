import { Document, Font, pdf } from '@react-pdf/renderer'
import type { ComponentType } from 'react'
import type {
  Page,
  PageData,
} from '../../../components/page-builder/usePageList'
import { gillSans, gillSansBold } from './assets'
import { CalendarPdf } from './Calendar'
import { ClosingPdf } from './Closing'
import { CoverPdf } from './Cover'
import { EventPdf } from './Event'
import { ImagePdf } from './Image'
import { NoticePdf } from './Notice'
import { OfferingsPdf } from './Offerings'
import { PhotosPdf } from './Photos'
import { WhatsappPdf } from './Whatsapp'
import { CHURCH_NAME } from '../../../lib/church'

// Same idea as defineModel: each page keeps its own data type inside the map.
const anyData = <D,>(component: ComponentType<{ data: D }>) =>
  component as unknown as ComponentType<{ data: PageData }>

const PAGES: Record<string, ComponentType<{ data: PageData }>> = {
  cover: anyData(CoverPdf),
  calendar: anyData(CalendarPdf),
  event: anyData(EventPdf),
  image: anyData(ImagePdf),
  notice: anyData(NoticePdf),
  photos: anyData(PhotosPdf),
  offerings: anyData(OfferingsPdf),
  whatsapp: anyData(WhatsappPdf),
  closing: anyData(ClosingPdf),
}

Font.register({
  family: 'GillSans',
  fonts: [{ src: gillSans }, { src: gillSansBold, fontWeight: 700 }],
})
// Keeps Portuguese words whole instead of breaking them with English hyphenation rules.
Font.registerHyphenationCallback((word) => [word])

export function renderBulletin(pages: Page[]) {
  return pdf(
    <Document
      title="Boletim informativo"
      author={CHURCH_NAME}
      creator={CHURCH_NAME}
      language="pt-BR"
    >
      {pages.map((page) => {
        const PdfPage = PAGES[page.type]

        return <PdfPage key={page.id} data={page.data} />
      })}
    </Document>
  ).toBlob()
}
