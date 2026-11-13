import {
  Defs,
  Image,
  LinearGradient,
  Rect,
  Stop,
  Svg,
  Text,
  View,
} from '@react-pdf/renderer'
import { titleSize } from '../../../lib/format'
import type { CoverData } from '../types'
import { PdfPage, base, colors, cq, tracking } from './styles'
import { churchLogoWhite } from './assets'

export function CoverPdf({ data }: { data: CoverData }) {
  return (
    <PdfPage style={base.dark}>
      {data.image && (
        <Image src={data.image.src} style={[base.fill, base.photo]} />
      )}
      <Svg viewBox="0 0 540 960" style={base.fill}>
        <Defs>
          <LinearGradient id="cover-shade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.ink} stopOpacity={0.55} />
            <Stop offset="0.3" stopColor={colors.ink} stopOpacity={0.15} />
            <Stop offset="0.72" stopColor={colors.ink} stopOpacity={0.92} />
            <Stop offset="1" stopColor={colors.ink} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="540" height="960" fill="url(#cover-shade)" />
      </Svg>
      {!data.image && (
        <Image
          src={churchLogoWhite}
          style={{
            position: 'absolute',
            top: cq(40),
            left: 0,
            right: 0,
            height: cq(32),
            objectFit: 'contain',
          }}
        />
      )}
      <View
        style={{
          position: 'absolute',
          left: cq(8),
          right: cq(8),
          bottom: cq(34),
          gap: cq(4),
        }}
      >
        <Text
          style={[
            base.title,
            { fontSize: cq(titleSize(data.title, 14)), lineHeight: 0.98 },
          ]}
        >
          {data.title}
        </Text>
      </View>
      {data.subtitle && (
        <Text
          style={{
            position: 'absolute',
            left: 0,
            bottom: cq(14),
            paddingVertical: cq(3),
            paddingLeft: cq(8),
            paddingRight: cq(7),
            backgroundColor: colors.gold,
            color: colors.ink,
            fontSize: cq(4.6),
            fontWeight: 700,
            letterSpacing: tracking(cq(4.6), 0.12),
            textTransform: 'uppercase',
          }}
        >
          {data.subtitle}
        </Text>
      )}
    </PdfPage>
  )
}
