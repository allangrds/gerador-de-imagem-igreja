import { TextField } from '../../../components/Field'
import { ImageField } from '../../../components/page-builder/ImageField'
import { defineModel } from '../../../components/page-builder/types'
import type {
  FormProps,
  ModelProps,
} from '../../../components/page-builder/types'
import { monthName } from '../../../lib/format'
import { ArtCanvas } from '../art/ArtCanvas'
import type { AgendaCoverData } from '../types'

function Preview({ data }: ModelProps<AgendaCoverData>) {
  return <ArtCanvas type="cover" data={data} />
}

function Form({ data, onChange }: FormProps<AgendaCoverData>) {
  return (
    <>
      <TextField
        label="Título"
        value={data.title}
        maxLength={24}
        onChange={(event) => onChange({ title: event.target.value })}
      />
      <TextField
        label="Subtítulo"
        hint="Aparece na faixa dourada. Bom lugar para o período da agenda."
        value={data.subtitle}
        onChange={(event) => onChange({ subtitle: event.target.value })}
      />
      <ImageField
        label="Imagem de fundo"
        hint="A foto é escurecida embaixo para o título ficar legível."
        value={data.image}
        onChange={(image) => onChange({ image })}
      />
    </>
  )
}

export const cover = defineModel<AgendaCoverData>({
  type: 'cover',
  name: 'Capa',
  description: 'Primeira imagem do carrossel',
  persisted: true,
  defaults: () => ({
    title: 'Agenda',
    subtitle: monthName(new Date()),
    image: null,
  }),
  summary: (data) => data.title,
  Preview,
  Form,
})
