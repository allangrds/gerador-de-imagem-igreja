import defaultLogo from '../../../assets/comunidade-belem.png'
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
import { CHURCH_NAME } from '../../../lib/church'

function Preview({ data }: ModelProps<ClosingData>) {
  const socials = filledSocials(data)

  return (
    <Sheet className={page.light}>
      <div className={styles.body}>
        <img
          className={styles.logo}
          src={data.logo?.src ?? defaultLogo}
          alt=""
        />
        <div className={styles.church}>
          <span className={styles.name}>{CHURCH_NAME}</span>
          {data.address && (
            <span className={styles.address}>{data.address}</span>
          )}
        </div>
        {socials.length > 0 && (
          <>
            <span className={styles.rule} />
            <span className={page.kicker}>Siga a igreja</span>
            <ul className={styles.socials}>
              {socials.map((social) => (
                <li key={social.key} className={styles.social}>
                  <span className={styles.socialIcon}>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={social.icon} />
                    </svg>
                  </span>
                  {social.name}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className={styles.farewell}>
        <span className={styles.message}>{data.message}</span>
        <span className={styles.invite}>Te esperamos no próximo culto.</span>
      </div>
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
      <TextField
        label="Mensagem de despedida"
        value={data.message}
        maxLength={30}
        onChange={(event) => onChange({ message: event.target.value })}
      />
      <TextAreaField
        label="Endereço"
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
    message: 'Feliz sábado!',
    address: 'Rua Martim Affonso, 152 · Belenzinho\nSão Paulo – SP',
    instagram: '',
    youtube: '',
    facebook: '',
    site: '',
  }),
  summary: (data) => data.message,
  Preview,
  Form,
})
