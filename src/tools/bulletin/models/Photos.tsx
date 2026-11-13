import { TextAreaField, TextField } from '../../../components/Field'
import { ImageField } from '../../../components/page-builder/ImageField'
import { defineModel } from '../../../components/page-builder/types'
import type {
  FormProps,
  ModelProps,
} from '../../../components/page-builder/types'
import { titleSize } from '../../../lib/format'
import { PHOTOS_LIMIT } from '../types'
import type { PhotosData } from '../types'
import { ArrowIcon } from './ArrowIcon'
import page from './Page.module.css'
import { Sheet } from './Sheet'
import styles from './Photos.module.css'

function Preview({ data }: ModelProps<PhotosData>) {
  return (
    <Sheet>
      <div className={styles.mosaic}>
        {Array.from({ length: PHOTOS_LIMIT }, (_, index) => (
          <div key={index} className={styles.tile}>
            {data.images[index] && (
              <img className={page.photo} src={data.images[index].src} alt="" />
            )}
          </div>
        ))}
      </div>
      <div className={styles.body}>
        <span className={page.kicker}>Galeria</span>
        <h1
          className={`${page.title} ${styles.title}`}
          style={{ fontSize: `${titleSize(data.title, 10)}cqw` }}
        >
          {data.title}
        </h1>
        <p className={page.text}>{data.text}</p>
        <span className={`${page.button} ${styles.button}`}>
          {data.button}
          <ArrowIcon />
        </span>
      </div>
    </Sheet>
  )
}

function Form({ data, onChange }: FormProps<PhotosData>) {
  return (
    <>
      <TextField
        label="Título"
        value={data.title}
        maxLength={40}
        onChange={(event) => onChange({ title: event.target.value })}
      />
      <TextAreaField
        label="Texto"
        rows={3}
        maxLength={160}
        value={data.text}
        onChange={(event) => onChange({ text: event.target.value })}
      />
      <TextField
        label="Texto do botão"
        value={data.button}
        onChange={(event) => onChange({ button: event.target.value })}
      />
      <TextField
        label="Link do álbum"
        hint="O botão abre este link quando tocado no PDF."
        type="url"
        inputMode="url"
        placeholder="https://photos.app.goo.gl/…"
        value={data.link}
        onChange={(event) => onChange({ link: event.target.value })}
      />
      {Array.from({ length: PHOTOS_LIMIT }, (_, index) => (
        <ImageField
          key={index}
          label={`Foto ${index + 1}`}
          value={data.images[index] ?? null}
          onChange={(photo) => {
            const images = [...data.images]

            if (photo) {
              images[index] = photo
            } else {
              images.splice(index, 1)
            }

            onChange({ images: images.filter(Boolean) })
          }}
        />
      ))}
    </>
  )
}

export const photos = defineModel<PhotosData>({
  type: 'photos',
  name: 'Fotos',
  description: 'Mosaico com botão para o álbum',
  defaults: () => ({
    title: 'Reveja os momentos do culto',
    text: 'As fotos do sábado já estão no nosso álbum. Baixe, compartilhe e marque a igreja.',
    button: 'Ver as fotos',
    link: '',
    images: [],
  }),
  summary: (data) => data.title,
  Preview,
  Form,
})
