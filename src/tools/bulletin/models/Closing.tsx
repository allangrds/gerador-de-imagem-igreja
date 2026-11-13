import defaultLogo from '../../../assets/logo-iasd-belem-vertical-preto.png'
import { TextAreaField, TextField } from '../../../components/Field'
import { ImageField } from '../../../components/page-builder/ImageField'
import { defineModel } from '../../../components/page-builder/types'
import type {
  FormProps,
  ModelProps,
} from '../../../components/page-builder/types'
import type { ClosingData } from '../types'
import styles from './Closing.module.css'
import page from './Page.module.css'
import { Sheet } from './Sheet'
import { SOCIALS, filledSocials } from './socials'
import { CHURCH_LOGO_ALT } from '../../../lib/church'

function Preview({ data }: ModelProps<ClosingData>) {
  const socials = filledSocials(data)

  return (
    <Sheet className={page.light}>
      <div className={styles.body}>
        <img
          className={styles.logo}
          src={data.logo?.src ?? defaultLogo}
          alt={CHURCH_LOGO_ALT}
        />
        {socials.length > 0 && (
          <ul className={styles.socials}>
            {socials.map((social) => (
              <li key={social.key}>
                <svg
                  role="img"
                  aria-label={social.name}
                  className={styles.socialIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={social.icon} />
                </svg>
              </li>
            ))}
          </ul>
        )}
      </div>
      {data.address && (
        <div className={styles.footer}>
          <span className={styles.address}>{data.address}</span>
        </div>
      )}
    </Sheet>
  )
}

function Form({ data, onChange }: FormProps<ClosingData>) {
  return (
    <>
      <ImageField
        label="Logo"
        hint="Sem imagem, usa o logo da igreja."
        value={data.logo}
        onChange={(logo) => onChange({ logo })}
      />
      <TextAreaField
        label="Endereço"
        hint="Aparece no rodapé."
        rows={2}
        value={data.address}
        onChange={(event) => onChange({ address: event.target.value })}
      />
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Redes sociais</legend>
        <span className={styles.hint}>
          Deixe em branco a rede que não quiser mostrar.
        </span>
        {SOCIALS.map((social) => (
          <TextField
            key={social.key}
            label={`Link do ${social.name === 'Site' ? 'site' : social.name}`}
            type="url"
            inputMode="url"
            placeholder="https://…"
            value={data[social.key]}
            onChange={(event) => onChange({ [social.key]: event.target.value })}
          />
        ))}
      </fieldset>
    </>
  )
}

export const closing = defineModel<ClosingData>({
  type: 'closing',
  name: 'Página final',
  description: 'Logo, endereço e redes sociais',
  persisted: true,
  defaults: () => ({
    logo: null,
    address: 'Rua Martim Affonso, 152 · Belenzinho\nSão Paulo – SP',
    instagram: 'https://www.instagram.com/adventistas_belemsp/',
    youtube: 'https://www.youtube.com/@iasdbelemsp',
    facebook: '',
    site: '',
  }),
  summary: (data) => data.address.split('\n')[0],
  Preview,
  Form,
})
