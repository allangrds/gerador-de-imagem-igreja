import {
  SelectField,
  TextAreaField,
  TextField,
} from '../../../components/Field'
import { defineModel } from '../../../components/page-builder/types'
import type {
  FormProps,
  ModelProps,
} from '../../../components/page-builder/types'
import { titleSize } from '../../../lib/format'
import { buildPixPayload } from '../pix'
import { PIX_KEY_TYPES } from '../types'
import type { OfferingsData } from '../types'
import styles from './Offerings.module.css'
import page from './Page.module.css'
import { Sheet } from './Sheet'
import { Qr } from './Qr'

// The QR needs every field the PIX standard asks for; without them only the key is shown.
export function pixPayload(data: OfferingsData) {
  return data.pixKey && data.beneficiary && data.city
    ? buildPixPayload({
        key: data.pixKey,
        name: data.beneficiary,
        city: data.city,
      })
    : null
}

function Preview({ data }: ModelProps<OfferingsData>) {
  const payload = pixPayload(data)
  const account = [
    ['Banco', data.bank],
    ['Agência', data.agency],
    ['Conta', data.account],
  ].filter(([, value]) => value)

  return (
    <Sheet className={`${page.light} ${styles.page}`}>
      <div className={styles.heading}>
        <span className={page.kicker}>Fidelidade</span>
        <h1
          className={page.title}
          style={{ fontSize: `${titleSize(data.title, 11)}cqw` }}
        >
          {data.title}
        </h1>
      </div>
      {data.verse && (
        <blockquote className={styles.verse}>
          <p>{data.verse}</p>
          <cite>{data.reference}</cite>
        </blockquote>
      )}
      {data.pixKey && (
        <div className={styles.pix}>
          {payload && (
            <Qr text={payload} label="QR Code do PIX" className={styles.qr} />
          )}
          <div className={styles.pixText}>
            <span className={styles.badge}>PIX</span>
            <span className={styles.item}>
              <span className={styles.label}>Chave PIX · {data.keyType}</span>
              <span className={styles.key}>{data.pixKey}</span>
            </span>
            {data.beneficiary && (
              <span className={styles.item}>
                <span className={styles.label}>Favorecido</span>
                <span className={styles.value}>{data.beneficiary}</span>
              </span>
            )}
          </div>
        </div>
      )}
      {account.length > 0 && (
        <dl className={styles.account}>
          {account.map(([label, value]) => (
            <div key={label} className={styles.item}>
              <dt className={styles.label}>{label}</dt>
              <dd className={styles.accountValue}>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <p className={`${page.text} ${styles.note}`}>{data.note}</p>
    </Sheet>
  )
}

function Form({ data, onChange }: FormProps<OfferingsData>) {
  return (
    <>
      <TextField
        label="Título"
        value={data.title}
        onChange={(event) => onChange({ title: event.target.value })}
      />
      <TextAreaField
        label="Versículo"
        rows={3}
        value={data.verse}
        onChange={(event) => onChange({ verse: event.target.value })}
      />
      <TextField
        label="Referência do versículo"
        value={data.reference}
        onChange={(event) => onChange({ reference: event.target.value })}
      />
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>PIX</legend>
        <SelectField
          label="Tipo"
          options={PIX_KEY_TYPES}
          value={data.keyType}
          onChange={(event) => onChange({ keyType: event.target.value })}
        />
        <TextField
          label="Chave"
          value={data.pixKey}
          onChange={(event) => onChange({ pixKey: event.target.value })}
        />
        <TextField
          label="Favorecido"
          hint="Nome da conta que recebe, como aparece no banco."
          value={data.beneficiary}
          onChange={(event) => onChange({ beneficiary: event.target.value })}
        />
        <TextField
          label="Cidade"
          hint="O PIX exige a cidade para gerar o QR Code."
          value={data.city}
          onChange={(event) => onChange({ city: event.target.value })}
        />
      </fieldset>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Conta bancária</legend>
        <TextField
          label="Banco"
          value={data.bank}
          onChange={(event) => onChange({ bank: event.target.value })}
        />
        <div className={styles.row}>
          <TextField
            label="Agência"
            inputMode="numeric"
            value={data.agency}
            onChange={(event) => onChange({ agency: event.target.value })}
          />
          <TextField
            label="Conta"
            inputMode="numeric"
            value={data.account}
            onChange={(event) => onChange({ account: event.target.value })}
          />
        </div>
      </fieldset>
      <TextAreaField
        label="Observação"
        rows={3}
        value={data.note}
        onChange={(event) => onChange({ note: event.target.value })}
      />
    </>
  )
}

export const offerings = defineModel<OfferingsData>({
  type: 'offerings',
  name: 'Dízimos e ofertas',
  description: 'PIX com QR Code e conta bancária',
  defaults: () => ({
    title: 'Dízimos e ofertas',
    verse:
      '“Trazei todos os dízimos à casa do Tesouro, para que haja mantimento na minha casa.”',
    reference: 'Malaquias 3:10',
    keyType: 'CNPJ',
    pixKey: '',
    beneficiary: '',
    city: 'São Paulo',
    bank: '',
    agency: '',
    account: '',
    note: 'Você também pode entregar no envelope durante o culto. Obrigado pela fidelidade!',
  }),
  summary: (data) => (data.pixKey ? `PIX ${data.pixKey}` : 'Sem chave PIX'),
  Preview,
  Form,
})
