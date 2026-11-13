import { PageBuilder } from '../../components/page-builder/PageBuilder'
import type { Page } from '../../components/page-builder/usePageList'
import { datedFileName, downloadBlob } from '../../lib/download'
import { renderAgendaZip } from './exportZip'
import { agendaModels } from './models'
import { CAROUSEL_LIMIT } from './types'

async function exportZip(pages: Page[]) {
  const blob = await renderAgendaZip(pages)
  const fileName = datedFileName('agenda-iasd-belem', 'zip')
  downloadBlob(blob, fileName)

  return fileName
}

export function AgendaEditor() {
  return (
    <PageBuilder
      title="Agenda para Instagram"
      intro="Monte o carrossel da agenda: escolha os modelos, coloque na ordem e baixe todas as imagens num .zip."
      storageKey="agenda"
      models={agendaModels}
      initial={['cover', 'dates', 'closing']}
      aspectRatio="4 / 5"
      max={CAROUSEL_LIMIT}
      labels={{
        unit: 'imagem',
        unitPlural: 'imagens',
        listTitle: 'Imagens do carrossel',
        size: 'JPG 1080 × 1350',
        exportLabel: 'Baixar .zip',
        exportingLabel: 'Gerando as imagens…',
        doneLabel: '.zip baixado',
        hint: 'Vão num .zip, numeradas na ordem do carrossel.',
      }}
      onExport={exportZip}
    />
  )
}
