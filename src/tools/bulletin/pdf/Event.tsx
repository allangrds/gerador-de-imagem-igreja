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
import { joinParts, longDate, titleSize } from '../../../lib/format'
import type { EventData } from '../types'
import { Icon, PdfPage, base, colors, cq, tracking } from './styles'

const CALENDAR =
  'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M3 10h18 M8 3v4 M16 3v4'

export function EventPdf({ data }: { data: EventData }) {
  const when = joinParts([longDate(data.date), data.time])
  const photoHeight = cq(78)

  return (
    <PdfPage style={base.dark}>
      <View
        style={{
          position: 'relative',
          height: photoHeight,
          backgroundColor: '#2A251E',
        }}
      >
        {data.image && <Image src={data.image.src} style={base.photo} />}
        <Svg
          viewBox={`0 0 540 ${photoHeight}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 540,
            height: photoHeight,
          }}
        >
          <Defs>
            <LinearGradient id="event-fade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0.55" stopColor={colors.ink} stopOpacity={0} />
              <Stop offset="1" stopColor={colors.ink} stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width="540"
            height={photoHeight}
            fill="url(#event-fade)"
          />
        </Svg>
        <Text
          style={{
            position: 'absolute',
            left: 0,
            bottom: cq(4),
            paddingVertical: cq(2.2),
            paddingLeft: cq(8),
            paddingRight: cq(6),
            backgroundColor: colors.gold,
            color: colors.ink,
            fontSize: cq(3.4),
            fontWeight: 700,
            letterSpacing: tracking(cq(3.4), 0.2),
            textTransform: 'uppercase',
          }}
        >
          Evento
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          gap: cq(5),
          paddingTop: cq(6),
          paddingHorizontal: cq(8),
          paddingBottom: cq(8),
        }}
      >
        <Text style={[base.title, { fontSize: cq(titleSize(data.name, 11)) }]}>
          {data.name}
        </Text>
        {when && (
          <View
            style={{ flexDirection: 'row', alignItems: 'center', gap: cq(3) }}
          >
            <Icon d={CALENDAR} size={cq(5.4)} color={colors.gold} />
            <Text style={{ color: colors.gold, fontSize: cq(4.2) }}>
              {when}
            </Text>
          </View>
        )}
        <Text style={base.text}>{data.description}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: cq(4),
            marginTop: 'auto',
            paddingTop: cq(4.5),
            borderTopWidth: cq(0.3),
            borderTopColor: colors.inkSoft,
          }}
        >
          <Text
            style={{
              color: colors.mutedOnDark,
              fontSize: cq(3.2),
              letterSpacing: tracking(cq(3.2), 0.2),
              textTransform: 'uppercase',
            }}
          >
            Valor
          </Text>
          <Text
            style={{ color: colors.gold, fontSize: cq(7.4), fontWeight: 700 }}
          >
            {data.price || 'Gratuito'}
          </Text>
        </View>
      </View>
    </PdfPage>
  )
}
