import type { Page } from '../../components/page-builder/usePageList'

// The PDF library is heavy, so it only loads when someone downloads.
export async function renderBulletinPdf(pages: Page[]) {
  const { renderBulletin } = await import('./pdf/Bulletin')

  return renderBulletin(pages)
}
