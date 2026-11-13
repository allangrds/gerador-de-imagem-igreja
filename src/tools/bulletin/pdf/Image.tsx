import { Image, Text } from '@react-pdf/renderer'
import type { ImageData } from '../types'
import { MaybeLink, PdfPage, base, colors, cq } from './styles'

export function ImagePdf({ data }: { data: ImageData }) {
  return (
    <PdfPage style={base.dark}>
      {data.image ? (
        <MaybeLink href={data.link} style={base.fill}>
          <Image
            src={data.image.src}
            style={[base.photo, { objectFit: data.fit }]}
          />
        </MaybeLink>
      ) : (
        <Text
          style={{
            marginTop: 'auto',
            marginBottom: 'auto',
            color: colors.mutedOnDark,
            fontSize: cq(4),
            textAlign: 'center',
          }}
        >
          Sem imagem
        </Text>
      )}
    </PdfPage>
  )
}
