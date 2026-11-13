import { Image, Text, View } from '@react-pdf/renderer'
import { filledSocials } from '../models/socials'
import { CHURCH_NAME } from '../types'
import type { ClosingData } from '../types'
import { churchLogo } from './assets'
import { Icon, MaybeLink, PdfPage, base, colors, cq, tracking } from './styles'

export function ClosingPdf({ data }: { data: ClosingData }) {
  const socials = filledSocials(data)

  return (
    <PdfPage style={base.light}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          gap: cq(5),
          paddingTop: cq(16),
          paddingHorizontal: cq(8),
          textAlign: 'center',
        }}
      >
        <Image
          src={data.logo?.src ?? churchLogo}
          style={{ width: cq(84), height: cq(40), objectFit: 'contain' }}
        />
        <View style={{ alignItems: 'center', gap: cq(1.6) }}>
          <Text
            style={{
              fontSize: cq(5.2),
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: tracking(cq(5.2), 0.06),
              textTransform: 'uppercase',
            }}
          >
            {CHURCH_NAME}
          </Text>
          {data.address && (
            <Text
              style={{
                color: colors.oliveText,
                fontSize: cq(3.6),
                lineHeight: 1.45,
              }}
            >
              {data.address}
            </Text>
          )}
        </View>
        {socials.length > 0 && (
          <>
            <View
              style={{
                width: cq(14),
                height: cq(0.8),
                backgroundColor: colors.gold,
              }}
            />
            <Text style={[base.kicker, { color: colors.oliveText }]}>
              Siga a igreja
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: cq(5),
              }}
            >
              {socials.map((social) => (
                <MaybeLink
                  key={social.key}
                  href={data[social.key]}
                  style={{
                    alignItems: 'center',
                    gap: cq(2),
                    color: colors.ink,
                    textDecoration: 'none',
                  }}
                >
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: cq(15),
                      height: cq(15),
                      borderRadius: cq(7.5),
                      backgroundColor: colors.ink,
                    }}
                  >
                    <Icon d={social.icon} size={cq(7)} color={colors.paper} />
                  </View>
                  <Text
                    style={{
                      fontSize: cq(2.8),
                      letterSpacing: tracking(cq(2.8), 0.08),
                    }}
                  >
                    {social.name}
                  </Text>
                </MaybeLink>
              ))}
            </View>
          </>
        )}
      </View>
      <View
        style={{
          alignItems: 'center',
          gap: cq(1.6),
          paddingVertical: cq(9),
          paddingHorizontal: cq(8),
          backgroundColor: colors.ink,
        }}
      >
        <Text
          style={{
            color: colors.gold,
            fontSize: cq(8),
            fontWeight: 700,
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          {data.message}
        </Text>
        <Text style={{ color: colors.mutedOnDark, fontSize: cq(3.4) }}>
          Te esperamos no próximo culto.
        </Text>
      </View>
    </PdfPage>
  )
}
