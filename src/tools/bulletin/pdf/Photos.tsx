import { Image, Text, View } from '@react-pdf/renderer'
import type { PhotosData } from '../types'
import { titleSize } from '../../../lib/format'
import {
  ARROW,
  Icon,
  MaybeLink,
  PAGE_SIZE,
  PdfPage,
  base,
  colors,
  cq,
} from './styles'

const TILE_COLORS = ['#5F5944', '#4A4535', '#2A251E']

export function PhotosPdf({ data }: { data: PhotosData }) {
  const gap = cq(1.4)
  const height = cq(92)
  const half = (PAGE_SIZE[0] - gap) / 2

  const tile = (index: number, tileHeight: number) => (
    <View
      style={{
        width: half,
        height: tileHeight,
        overflow: 'hidden',
        backgroundColor: TILE_COLORS[index],
      }}
    >
      {data.images[index] && (
        <Image src={data.images[index].src} style={base.photo} />
      )}
    </View>
  )

  return (
    <PdfPage style={base.dark}>
      <View style={{ flexDirection: 'row', gap, height }}>
        {tile(0, height)}
        <View style={{ gap }}>
          {tile(1, (height - gap) / 2)}
          {tile(2, (height - gap) / 2)}
        </View>
      </View>
      <View
        style={{
          flex: 1,
          gap: cq(5),
          paddingTop: cq(9),
          paddingHorizontal: cq(8),
          paddingBottom: cq(10),
        }}
      >
        <Text style={base.kicker}>Galeria</Text>
        <Text
          style={[
            base.title,
            { fontSize: cq(titleSize(data.title, 10)), lineHeight: 1.02 },
          ]}
        >
          {data.title}
        </Text>
        <Text style={base.text}>{data.text}</Text>
        <MaybeLink
          href={data.link}
          style={[base.button, { marginTop: 'auto' }]}
        >
          <Text>{data.button}</Text>
          <Icon d={ARROW} size={cq(5.4)} color={colors.ink} strokeWidth={2.2} />
        </MaybeLink>
      </View>
    </PdfPage>
  )
}
