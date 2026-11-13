import { Text, View } from '@react-pdf/renderer'
import type { WhatsappData } from '../types'
import { titleSize } from '../../../lib/format'
import { ARROW, Icon, MaybeLink, PdfPage, Qr, base, colors, cq } from './styles'

const CHAT =
  'M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.2A8.5 8.5 0 1 1 20 11.5z M8.5 10h7 M8.5 13.5h4.5'

export function WhatsappPdf({ data }: { data: WhatsappData }) {
  return (
    <PdfPage
      style={[
        base.dark,
        {
          gap: cq(6),
          paddingTop: cq(16),
          paddingHorizontal: cq(8),
          paddingBottom: cq(10),
        },
      ]}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: cq(22),
          height: cq(22),
          borderRadius: cq(11),
          backgroundColor: colors.gold,
        }}
      >
        <Icon d={CHAT} size={cq(11)} color={colors.ink} />
      </View>
      <View style={{ gap: cq(4) }}>
        <Text style={base.kicker}>WhatsApp</Text>
        <Text style={[base.title, { fontSize: cq(titleSize(data.title, 11)) }]}>
          {data.title}
        </Text>
        <Text style={[base.text, { fontSize: cq(4.4) }]}>{data.text}</Text>
      </View>
      <MaybeLink href={data.link} style={base.button}>
        <Text>{data.button}</Text>
        <Icon d={ARROW} size={cq(5.4)} color={colors.ink} strokeWidth={2.2} />
      </MaybeLink>
      {data.link && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: cq(5),
            marginTop: 'auto',
            paddingTop: cq(6),
            borderTopWidth: cq(0.3),
            borderTopColor: colors.inkSoft,
          }}
        >
          <View
            style={{
              padding: cq(2),
              borderRadius: cq(2),
              backgroundColor: colors.paper,
            }}
          >
            <Qr text={data.link} size={cq(24)} />
          </View>
          <Text
            style={{
              flex: 1,
              color: colors.mutedOnDark,
              fontSize: cq(3.8),
              lineHeight: 1.45,
            }}
          >
            Ou aponte a câmera do celular para o código.
          </Text>
        </View>
      )}
    </PdfPage>
  )
}
