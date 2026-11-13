import { Link, Page, Path, StyleSheet, Svg, View } from '@react-pdf/renderer'
import type { ComponentProps, ReactNode } from 'react'
import { qrPath } from '../qr'

export const PAGE_SIZE: [number, number] = [540, 960]

// Same numbers as the cqw values in the preview CSS: 1cq is 1% of the page width.
export const cq = (value: number) => (value * PAGE_SIZE[0]) / 100

// CSS letter-spacing in em becomes points in the PDF.
export const tracking = (fontSize: number, em: number) => fontSize * em

export const colors = {
  ink: '#141210',
  inkSoft: '#4A4535',
  paper: '#F6F2E9',
  gold: '#C6B98C',
  goldDeep: '#8C7F55',
  oliveText: '#5F5944',
  line: '#E3DCCB',
  lineStrong: '#CFC6AE',
  mutedOnDark: '#BDB49A',
  textOnDark: '#E9E3D3',
  textOnLight: '#2E2A22',
  white: '#FFFFFF',
}

export const base = StyleSheet.create({
  dark: {
    position: 'relative',
    flexDirection: 'column',
    backgroundColor: colors.ink,
    color: colors.paper,
    fontFamily: 'GillSans',
  },
  light: {
    position: 'relative',
    flexDirection: 'column',
    backgroundColor: colors.paper,
    color: colors.ink,
    fontFamily: 'GillSans',
  },
  kicker: {
    color: colors.gold,
    fontSize: cq(3.2),
    letterSpacing: tracking(cq(3.2), 0.22),
    textTransform: 'uppercase',
  },
  title: {
    fontSize: cq(11),
    fontWeight: 700,
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  text: {
    color: colors.textOnDark,
    fontSize: cq(4.2),
    lineHeight: 1.5,
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: PAGE_SIZE[0],
    height: PAGE_SIZE[1],
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: cq(3),
    height: cq(14),
    borderRadius: cq(2),
    backgroundColor: colors.gold,
    color: colors.ink,
    fontSize: cq(4.8),
    fontWeight: 700,
    letterSpacing: tracking(cq(4.8), 0.08),
    textTransform: 'uppercase',
    textDecoration: 'none',
  },
})

type IconProps = {
  d: string
  size: number
  color: string
  strokeWidth?: number
}

// Stroke icons drawn on a 24 × 24 grid, like the ones in the preview.
export function Icon({ d, size, color, strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <Path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export const ARROW = 'M5 12h14 M13 6l6 6-6 6'

export function Qr({ text, size }: { text: string; size: number }) {
  const { size: modules, path } = qrPath(text)

  return (
    <Svg
      viewBox={`0 0 ${modules} ${modules}`}
      style={{ width: size, height: size }}
    >
      <Path d={path} fill={colors.ink} />
    </Svg>
  )
}

type MaybeLinkProps = {
  href: string
  style: ComponentProps<typeof View>['style']
  children: ReactNode
}

// Turns the area into a clickable link only when there is an address.
export function MaybeLink({ href, style, children }: MaybeLinkProps) {
  return href.trim() ? (
    <Link src={href.trim()} style={style}>
      {children}
    </Link>
  ) : (
    <View style={style}>{children}</View>
  )
}

type PdfPageProps = {
  style: ComponentProps<typeof View>['style']
  children: ReactNode
}

// A fixed 9:16 page. wrap={false} on the Page itself would shrink it to the content,
// so the frame inside keeps the size and cuts long texts like the preview does.
export function PdfPage({ style, children }: PdfPageProps) {
  const styles = Array.isArray(style) ? style : [style]

  return (
    <Page size={PAGE_SIZE}>
      <View
        wrap={false}
        style={[
          { width: PAGE_SIZE[0], height: PAGE_SIZE[1], overflow: 'hidden' },
          ...styles,
        ]}
      >
        {children}
      </View>
    </Page>
  )
}
