import { ImageField } from '../../../components/page-builder/ImageField'
import { defineModel } from '../../../components/page-builder/types'
import type {
  FormProps,
  ModelProps,
} from '../../../components/page-builder/types'
import { ArtCanvas } from '../art/ArtCanvas'
import type { AgendaClosingData } from '../types'

function Preview({ data }: ModelProps<AgendaClosingData>) {
  return <ArtCanvas type="closing" data={data} />
}

function Form({ data, onChange }: FormProps<AgendaClosingData>) {
  return (
    <ImageField
      label="Logo da igreja"
      hint="Sem imagem, usa o logo da igreja."
      value={data.logo}
      onChange={(logo) => onChange({ logo })}
    />
  )
}

export const closing = defineModel<AgendaClosingData>({
  type: 'closing',
  name: 'Final',
  description: 'Logo e convite para salvar e compartilhar',
  persisted: true,
  defaults: () => ({
    logo: null,
  }),
  summary: (data) => (data.logo ? data.logo.name : 'Logo da igreja'),
  Preview,
  Form,
})
