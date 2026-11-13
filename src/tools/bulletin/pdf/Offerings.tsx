import { Text, View } from '@react-pdf/renderer'
import { pixPayload } from '../models/Offerings'
import { titleSize } from '../../../lib/format'
import type { OfferingsData } from '../types'
import { PdfPage, Qr, base, colors, cq, tracking } from './styles'

const label = {
  color: colors.oliveText,
  fontSize: cq(2.8),
  letterSpacing: tracking(cq(2.8), 0.12),
  textTransform: 'uppercase' as const,
}

export function OfferingsPdf({ data }: { data: OfferingsData }) {
  const payload = pixPayload(data)
  const account = [
    ['Banco', data.bank],
    ['Agência', data.agency],
    ['Conta', data.account],
  ].filter(([, value]) => value)

  return (
    <PdfPage
      style={[
        base.light,
        {
          gap: cq(6),
          paddingTop: cq(12),
          paddingHorizontal: cq(8),
          paddingBottom: cq(10),
        },
      ]}
    >
      <View style={{ gap: cq(2) }}>
        <Text style={[base.kicker, { color: colors.oliveText }]}>
          Fidelidade
        </Text>
        <Text style={[base.title, { fontSize: cq(titleSize(data.title, 11)) }]}>
          {data.title}
        </Text>
      </View>
      {data.verse && (
        <View style={{ gap: cq(2) }}>
          <Text
            style={{
              color: colors.textOnLight,
              fontSize: cq(4.6),
              lineHeight: 1.45,
            }}
          >
            {data.verse}
          </Text>
          <Text
            style={{
              color: colors.goldDeep,
              fontSize: cq(3.4),
              fontWeight: 700,
              letterSpacing: tracking(cq(3.4), 0.12),
              textTransform: 'uppercase',
            }}
          >
            {data.reference}
          </Text>
        </View>
      )}
      {data.pixKey && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: cq(5),
            padding: cq(5),
            borderWidth: cq(0.3),
            borderColor: colors.line,
            borderRadius: cq(3),
            backgroundColor: colors.white,
          }}
        >
          {payload && <Qr text={payload} size={cq(30)} />}
          <View style={{ flex: 1, gap: cq(3) }}>
            <Text
              style={{
                alignSelf: 'flex-start',
                paddingVertical: cq(0.8),
                paddingHorizontal: cq(2.4),
                borderRadius: cq(3),
                backgroundColor: colors.ink,
                color: colors.gold,
                fontSize: cq(2.8),
                fontWeight: 700,
                letterSpacing: tracking(cq(2.8), 0.16),
              }}
            >
              PIX
            </Text>
            <View style={{ gap: cq(0.6) }}>
              <Text style={label}>Chave PIX · {data.keyType}</Text>
              <Text style={{ fontSize: cq(4.4), fontWeight: 700 }}>
                {data.pixKey}
              </Text>
            </View>
            {data.beneficiary && (
              <View style={{ gap: cq(0.6) }}>
                <Text style={label}>Favorecido</Text>
                <Text style={{ fontSize: cq(3.6) }}>{data.beneficiary}</Text>
              </View>
            )}
          </View>
        </View>
      )}
      {account.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            gap: cq(3),
            paddingTop: cq(4),
            borderTopWidth: cq(0.3),
            borderTopColor: colors.lineStrong,
          }}
        >
          {account.map(([name, value]) => (
            <View key={name} style={{ flex: 1, gap: cq(0.6) }}>
              <Text style={label}>{name}</Text>
              <Text style={{ fontSize: cq(3.8), fontWeight: 700 }}>
                {value}
              </Text>
            </View>
          ))}
        </View>
      )}
      <Text
        style={{
          marginTop: 'auto',
          color: colors.inkSoft,
          fontSize: cq(3.6),
          lineHeight: 1.5,
        }}
      >
        {data.note}
      </Text>
    </PdfPage>
  )
}
