import { TextField } from '../../../components/Field'
import { ImageField } from '../../../components/page-builder/ImageField'
import { defineModel } from '../../../components/page-builder/types'
import type {
  FormProps,
  ModelProps,
} from '../../../components/page-builder/types'
import { Segmented } from '../../../components/Segmented'
import type { ImageData } from '../types'
import styles from './Image.module.css'
import page from './Page.module.css'

function Preview({ data }: ModelProps<ImageData>) {
  return (
    <div className={`${page.page} ${styles.page}`}>
      {data.image ? (
        <img
          className={styles.image}
          style={{ objectFit: data.fit }}
          src={data.image.src}
          alt=""
        />
      ) : (
        <span className={styles.empty}>Sua imagem aqui</span>
      )}
    </div>
  )
}

function Form({ data, onChange }: FormProps<ImageData>) {
  return (
    <>
      <ImageField
        label="Imagem"
        hint="Um cartaz pronto ou uma foto. De preferência na vertical."
        value={data.image}
        onChange={(image) => onChange({ image })}
      />
      <div className={styles.fit}>
        <span className={styles.label} aria-hidden="true">
          Como a imagem ocupa a página
        </span>
        <Segmented
          label="Como a imagem ocupa a página"
          value={data.fit}
          onChange={(fit) => onChange({ fit })}
          options={[
            { value: 'cover', label: 'Preencher' },
            { value: 'contain', label: 'Mostrar inteira' },
          ]}
        />
        <span className={styles.hint}>
          {data.fit === 'cover'
            ? 'Cobre tudo, pode cortar as bordas.'
            : 'Sem cortes, com faixas escuras.'}
        </span>
      </div>
      <TextField
        label="Link (opcional)"
        hint="Quem tocar na imagem dentro do PDF abre este endereço."
        type="url"
        inputMode="url"
        placeholder="https://…"
        value={data.link}
        onChange={(event) => onChange({ link: event.target.value })}
      />
    </>
  )
}

export const image = defineModel<ImageData>({
  type: 'image',
  name: 'Imagem',
  description: 'Uma imagem na página inteira',
  defaults: () => ({ image: null, fit: 'cover', link: '' }),
  summary: (data) => data.image?.name ?? 'Sem imagem',
  Preview,
  Form,
})
