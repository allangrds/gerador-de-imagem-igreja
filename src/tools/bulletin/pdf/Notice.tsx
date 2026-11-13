import { Text, View } from '@react-pdf/renderer'
import { CHURCH_NAME } from '../types'
import { titleSize } from '../format'
import type { NoticeData } from '../types'
import { Icon, PdfPage, base, colors, cq, tracking } from './styles'

const MEGAPHONE =
  'M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z M17 9a4 4 0 0 1 0 6'

export function NoticePdf({ data }: { data: NoticeData }) {
  return (
    <PdfPage style={base.light}>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-start',
          alignItems: 'center',
          gap: cq(2.4),
          marginTop: cq(12),
          paddingVertical: cq(2.4),
          paddingLeft: cq(8),
          paddingRight: cq(6),
          backgroundColor: colors.ink,
        }}
      >
        <Icon
          d={MEGAPHONE}
          size={cq(4.4)}
          color={colors.gold}
          strokeWidth={2}
        />
        <Text
          style={{
            color: colors.gold,
            fontSize: cq(3.4),
            fontWeight: 700,
            letterSpacing: tracking(cq(3.4), 0.2),
            textTransform: 'uppercase',
          }}
        >
          Comunicado
        </Text>
      </View>
      <View style={{ flex: 1, gap: cq(6), padding: cq(8), paddingBottom: 0 }}>
        <Text
          style={[
            base.title,
            { fontSize: cq(titleSize(data.title, 9.4)), lineHeight: 1.05 },
          ]}
        >
          {data.title}
        </Text>
        <View
          style={{ width: cq(16), height: cq(1), backgroundColor: colors.gold }}
        />
        <Text
          style={[
            base.text,
            { color: colors.textOnLight, fontSize: cq(4.4), lineHeight: 1.55 },
          ]}
        >
          {data.text}
        </Text>
      </View>
      <View
        style={{ gap: cq(1), paddingHorizontal: cq(8), paddingBottom: cq(10) }}
      >
        <Text style={{ fontSize: cq(4.2), fontWeight: 700 }}>
          {data.signature}
        </Text>
        <Text style={{ color: colors.oliveText, fontSize: cq(3.2) }}>
          {CHURCH_NAME}
        </Text>
      </View>
    </PdfPage>
  )
}
