import { Text, View } from '@react-pdf/renderer'
import {
  dayAndMonth,
  formatTime,
  joinParts,
  sortByDate,
  titleSize,
  weekday,
} from '../../../lib/format'
import type { CalendarData } from '../types'
import { PdfPage, base, colors, cq, tracking } from './styles'

export function CalendarPdf({ data }: { data: CalendarData }) {
  return (
    <PdfPage
      style={[base.light, { gap: cq(7), padding: cq(8), paddingTop: cq(12) }]}
    >
      <View style={{ gap: cq(2) }}>
        <Text style={[base.kicker, { color: colors.oliveText }]}>Agenda</Text>
        <Text style={[base.title, { fontSize: cq(titleSize(data.title, 11)) }]}>
          {data.title}
        </Text>
      </View>
      <View>
        {sortByDate(data.events).map((event, index) => {
          const { day, month } = dayAndMonth(event.date)

          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                gap: cq(4.5),
                paddingVertical: cq(4.5),
                borderTopWidth: cq(0.3),
                borderTopColor: colors.lineStrong,
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: cq(14),
                  height: cq(15),
                  borderRadius: cq(1.6),
                  backgroundColor: colors.ink,
                }}
              >
                <Text
                  style={{
                    color: colors.paper,
                    fontSize: cq(6),
                    fontWeight: 700,
                  }}
                >
                  {day}
                </Text>
                <Text
                  style={{
                    marginTop: cq(1.5),
                    color: colors.gold,
                    fontSize: cq(2.6),
                    lineHeight: 1,
                    letterSpacing: tracking(cq(2.6), 0.16),
                  }}
                >
                  {month}
                </Text>
              </View>
              <View style={{ flex: 1, gap: cq(1) }}>
                <Text
                  style={{
                    fontSize: cq(4.8),
                    fontWeight: 700,
                    lineHeight: 1.15,
                    textTransform: 'uppercase',
                  }}
                >
                  {event.name}
                </Text>
                <Text
                  style={{
                    color: colors.goldDeep,
                    fontSize: cq(3.3),
                    fontWeight: 700,
                    letterSpacing: tracking(cq(3.3), 0.04),
                  }}
                >
                  {joinParts([
                    weekday(event.date),
                    formatTime(event.hour, event.minute),
                  ])}
                </Text>
                {event.description && (
                  <Text
                    style={{
                      color: colors.inkSoft,
                      fontSize: cq(3.5),
                      lineHeight: 1.4,
                    }}
                  >
                    {event.description}
                  </Text>
                )}
              </View>
            </View>
          )
        })}
      </View>
    </PdfPage>
  )
}
