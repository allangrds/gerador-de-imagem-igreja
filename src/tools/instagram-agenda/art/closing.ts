import defaultLogo from '../../../assets/logo-iasd-belem-vertical-preto.png'
import { CHURCH_LOGO_ALT } from '../../../lib/church'
import { baselineFor } from '../../../lib/canvasText'
import type { AgendaClosingData } from '../types'
import {
  ART_HEIGHT,
  ART_WIDTH,
  COLORS,
  LINE_HEIGHT,
  artFont,
  defineArt,
  drawIcon,
  fillBackground,
  w,
} from './canvas'

const PADDING = w(8)
const GAP = w(8)
const LOGO_HEIGHT = w(40)
const ACTIONS = { size: w(3), gap: w(6), iconGap: w(1), icon: w(3.8) }
const INVITATIONS = [
  { text: 'Salve a agenda', icon: ['M6 3h12v18l-6-4-6 4z'] },
  {
    text: 'Envie para um amigo',
    icon: ['M21 3L10 14', 'M21 3l-7 18-4-7-7-4z'],
  },
]

// 40% of the width tall, narrower if the logo is too wide for the page.
function logoSize(logo: HTMLImageElement | null) {
  if (!logo) {
    return { width: 0, height: 0 }
  }

  const ratio = logo.naturalWidth / logo.naturalHeight
  const width = Math.min(LOGO_HEIGHT * ratio, ART_WIDTH - PADDING * 2)

  return { width, height: width / ratio }
}

// The logo over the two invitations, all centered on the page.
export const closingArt = defineArt<AgendaClosingData>({
  images: (data) => [data.logo?.src ?? defaultLogo],
  draw(ctx, _data, [logo]) {
    fillBackground(ctx, COLORS.paper)

    const lineHeight = ACTIONS.size * LINE_HEIGHT
    const actionsHeight = Math.max(lineHeight, ACTIONS.icon)
    const size = logoSize(logo)
    const top = (ART_HEIGHT - (size.height + GAP + actionsHeight)) / 2

    if (logo) {
      ctx.drawImage(
        logo,
        (ART_WIDTH - size.width) / 2,
        top,
        size.width,
        size.height
      )
    }

    ctx.font = artFont(400, ACTIONS.size)
    const widths = INVITATIONS.map(
      ({ text }) => ACTIONS.icon + ACTIONS.iconGap + ctx.measureText(text).width
    )
    const rowWidth =
      widths.reduce((sum, width) => sum + width, 0) +
      ACTIONS.gap * (INVITATIONS.length - 1)
    const rowTop = top + size.height + GAP
    const baseline = baselineFor(
      ctx,
      rowTop + (actionsHeight - lineHeight) / 2,
      lineHeight
    )
    let left = (ART_WIDTH - rowWidth) / 2

    ctx.fillStyle = COLORS.ink
    INVITATIONS.forEach(({ text, icon }, index) => {
      drawIcon(
        ctx,
        icon,
        left,
        rowTop + (actionsHeight - ACTIONS.icon) / 2,
        ACTIONS.icon,
        COLORS.ink
      )
      ctx.fillText(text, left + ACTIONS.icon + ACTIONS.iconGap, baseline)
      left += widths[index] + ACTIONS.gap
    })
  },
  label: () =>
    [CHURCH_LOGO_ALT, ...INVITATIONS.map(({ text }) => text)].join('. '),
})
