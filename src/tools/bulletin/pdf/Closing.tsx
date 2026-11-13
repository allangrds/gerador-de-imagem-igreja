import { Image, Text, View } from '@react-pdf/renderer'
import { filledSocials } from '../models/socials'
import type { ClosingData } from '../types'
import { churchLogo } from './assets'
import { Icon, MaybeLink, PdfPage, base, colors, cq } from './styles'

export function ClosingPdf({ data }: { data: ClosingData }) {
  const socials = filledSocials(data)

  return (
    <PdfPage style={base.light}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: cq(10),
          padding: cq(8),
        }}
      >
        <Image
          src={data.logo?.src ?? churchLogo}
          style={{ width: cq(84), height: cq(40), objectFit: 'contain' }}
        />
        {socials.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: cq(8),
            }}
          >
            {socials.map((social) => (
              <MaybeLink key={social.key} href={data[social.key]} style={{}}>
                <Icon d={social.icon} size={cq(9)} color={colors.ink} />
              </MaybeLink>
            ))}
          </View>
        )}
      </View>
      {data.address && (
        <View
          style={{
            alignItems: 'center',
            padding: cq(8),
            backgroundColor: colors.ink,
          }}
        >
          <Text
            style={{
              color: colors.textOnDark,
              fontSize: cq(3.8),
              lineHeight: 1.45,
              textAlign: 'center',
            }}
          >
            {data.address}
          </Text>
        </View>
      )}
    </PdfPage>
  )
}
