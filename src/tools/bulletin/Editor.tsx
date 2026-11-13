import { PageBuilder } from '../../components/page-builder/PageBuilder'
import type { Page } from '../../components/page-builder/usePageList'
import { datedFileName, downloadBlob } from '../../lib/download'
import { renderBulletinPdf } from './exportPdf'
import { bulletinModels } from './models'

async function exportPdf(pages: Page[]) {
  const blob = await renderBulletinPdf(pages)
  const fileName = datedFileName('boletim-iasd-belem', 'pdf')
  downloadBlob(blob, fileName)

  return fileName
}

export function BulletinEditor() {
  return (
    <PageBuilder
      title="Boletim em PDF"
      intro="Escolha os modelos, organize as páginas e edite cada uma. Os links e botões funcionam quando o PDF é aberto no celular."
      storageKey="bulletin"
      models={bulletinModels}
      initial={['cover', 'closing']}
      aspectRatio="9 / 16"
      labels={{
        unit: 'página',
        unitPlural: 'páginas',
        listTitle: 'Páginas do boletim',
        size: 'PDF 9:16',
        exportLabel: 'Baixar PDF',
        exportingLabel: 'Gerando PDF…',
        doneLabel: 'PDF baixado',
        hint: 'Texto selecionável e links clicáveis.',
      }}
      onExport={exportPdf}
    />
  )
}
