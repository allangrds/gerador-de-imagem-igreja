import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import logo from '../../assets/logo-iasd-belem-simbolo.png'
import { TextAreaField, TextField } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { Segmented } from '../../components/Segmented'
import { getStoredJson, setStoredJson } from '../../lib/storage'
import { buildMessage } from './buildMessage'
import styles from './Editor.module.css'
import { toSegments } from './formatWhatsApp'
import type { Segment } from './formatWhatsApp'
import { messageDefaults, messageModels } from './models'
import type { MessageData, MessageType } from './models'

const STORAGE_KEY = 'whatsapp_messages'
const COPIED_DURATION = 2400
const SEARCH_DELAY = 250

type Saved = {
  model: MessageType
  emojis: boolean
  data: Partial<Record<MessageType, MessageData>>
}

type State = Omit<Saved, 'data'> & {
  data: Record<MessageType, MessageData>
}

type Tab = 'models' | 'fields' | 'preview'

// Every model starts from its default text, with what was saved on top.
function loadSaved(): State {
  const saved = getStoredJson<Saved>(STORAGE_KEY, {
    model: 'culto',
    emojis: true,
    data: {},
  })
  const data = Object.fromEntries(
    messageModels.map((model) => [
      model.type,
      { ...messageDefaults(model.type), ...saved.data[model.type] },
    ])
  ) as State['data']

  return { ...saved, data }
}

// "Sábado" matches "sabado": no accents, no case.
function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function SegmentText({ segment }: { segment: Segment }) {
  const content = segment.link ? (
    <a href={segment.text} target="_blank" rel="noreferrer">
      {segment.text}
    </a>
  ) : (
    segment.text
  )

  if (segment.style === 'bold') {
    return <strong>{content}</strong>
  }

  if (segment.style === 'italic') {
    return <em>{content}</em>
  }

  if (segment.style === 'strike') {
    return <s>{content}</s>
  }

  return content
}

export function WhatsappEditor() {
  const [saved, setSaved] = useState(loadSaved)
  const [tab, setTab] = useState<Tab>('fields')
  const [plainText, setPlainText] = useState(false)
  const [copy, setCopy] = useState<'idle' | 'copied' | 'error'>('idle')
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')

  const { model: type, emojis, data } = saved
  const model = messageModels.find((item) => item.type === type)!
  const text = buildMessage(type, data[type], emojis)
  const lines = text.split('\n')
  const found = messageModels.filter((item) =>
    normalize(`${item.name} ${item.description}`).includes(
      normalize(search.trim())
    )
  )

  useEffect(() => {
    setStoredJson(STORAGE_KEY, saved)
  }, [saved])

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearch(query), SEARCH_DELAY)

    return () => window.clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    if (copy !== 'copied') {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopy('idle'), COPIED_DURATION)

    return () => window.clearTimeout(timeout)
  }, [copy])

  function change(next: Partial<State>) {
    setSaved((current) => ({ ...current, ...next }))
    setCopy('idle')
  }

  function setField(key: string, value: string) {
    change({ data: { ...data, [type]: { ...data[type], [key]: value } } })
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(text)
      setCopy('copied')
    } catch {
      setCopy('error')
    }
  }

  return (
    <main className={styles.page} data-tab={tab}>
      <div className={styles.pageHead}>
        <nav aria-label="Você está em" className={styles.breadcrumb}>
          <Link to="/">Ferramentas</Link>
          <span aria-hidden="true">/</span>
          <span>Mensagens para WhatsApp</span>
        </nav>
        <h1 className={styles.pageTitle}>Mensagens para WhatsApp</h1>
        <p className={styles.muted}>
          Escolha o modelo, ajuste as informações e copie a mensagem pronta, com
          negrito e itálico do WhatsApp.
        </p>
      </div>

      <div className={styles.tabs}>
        <Segmented
          label="Seções do editor"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'models', label: 'Modelos' },
            { value: 'fields', label: 'Editar' },
            { value: 'preview', label: 'Prévia' },
          ]}
        />
      </div>

      <div className={styles.columns}>
        <aside
          aria-labelledby="titulo-modelos"
          className={`${styles.panel} ${styles.models}`}
        >
          <div className={styles.panelHead}>
            <h2 id="titulo-modelos" className={styles.panelTitle}>
              Modelos
            </h2>
            <p className={styles.muted}>Escolha o tipo de mensagem.</p>
          </div>
          <TextField
            label="Buscar modelo"
            type="search"
            placeholder="Ex.: culto, retiro, aniversário"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {found.length === 0 && (
            <p className={styles.muted}>Nenhum modelo encontrado.</p>
          )}
          <ul className={styles.modelList}>
            {found.map((item) => (
              <li key={item.type}>
                <button
                  type="button"
                  className={styles.model}
                  aria-pressed={item.type === type}
                  onClick={() => {
                    change({ model: item.type })
                    setTab('fields')
                  }}
                >
                  <span className={styles.modelName}>{item.name}</span>
                  <span className={styles.modelDescription}>
                    {item.description}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section
          aria-labelledby="titulo-campos"
          className={`${styles.panel} ${styles.fields}`}
        >
          <div className={styles.fieldsHead}>
            <div>
              <span className={styles.muted}>Editando o modelo</span>
              <h2 id="titulo-campos" className={styles.editTitle}>
                {model.name}
              </h2>
            </div>
            <button
              type="button"
              className={styles.textButton}
              onClick={() =>
                change({ data: { ...data, [type]: messageDefaults(type) } })
              }
            >
              Restaurar texto do modelo
            </button>
          </div>

          <div className={styles.switchRow}>
            <span>
              <span id="rotulo-emojis" className={styles.switchLabel}>
                Incluir emojis
              </span>
              <span className={styles.muted}>
                Ícones no começo das linhas (data, local, horário).
              </span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={emojis}
              aria-labelledby="rotulo-emojis"
              className={styles.switch}
              onClick={() => change({ emojis: !emojis })}
            >
              <span className={styles.knob} />
            </button>
          </div>

          {model.fields.map((field) =>
            field.multiline ? (
              <TextAreaField
                key={`${type}-${field.key}`}
                label={field.label}
                hint={field.hint}
                placeholder={field.placeholder}
                rows={4}
                value={data[type][field.key]}
                onChange={(event) => setField(field.key, event.target.value)}
              />
            ) : (
              <TextField
                key={`${type}-${field.key}`}
                label={field.label}
                hint={field.hint}
                placeholder={field.placeholder}
                value={data[type][field.key]}
                onChange={(event) => setField(field.key, event.target.value)}
              />
            )
          )}

          <div className={styles.tips}>
            <strong>Formatação do WhatsApp</strong>
            <span>
              <code>*texto*</code> → <strong>negrito</strong> ·{' '}
              <code>_texto_</code> → <em>itálico</em> · <code>~texto~</code> →{' '}
              <s>riscado</s>
            </span>
            <span className={styles.muted}>
              Use nos campos de texto livre. Os campos ficam salvos neste
              aparelho.
            </span>
          </div>
        </section>

        <section
          aria-labelledby="titulo-previa"
          className={`${styles.panel} ${styles.preview}`}
        >
          <div className={styles.previewHead}>
            <h2 id="titulo-previa" className={styles.panelTitle}>
              Como fica no WhatsApp
            </h2>
            <div
              role="tablist"
              aria-label="Modo de visualização"
              className={styles.viewTabs}
            >
              <button
                type="button"
                role="tab"
                aria-selected={!plainText}
                onClick={() => setPlainText(false)}
              >
                Prévia
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={plainText}
                onClick={() => setPlainText(true)}
              >
                Texto puro
              </button>
            </div>
          </div>

          <div className={styles.phone}>
            <div className={styles.chatHead} aria-hidden="true">
              <span className={styles.avatar}>
                <img src={logo} alt="" />
              </span>
              <span className={styles.chatName}>
                <strong>Comunidade IASD Belém</strong>
                <span>Grupo de avisos</span>
              </span>
            </div>
            {plainText ? (
              <div className={styles.plain}>
                <pre>{text}</pre>
              </div>
            ) : (
              <div className={styles.chat}>
                <span className={styles.day}>Hoje</span>
                <div className={styles.bubble}>
                  {lines.map((line, index) => (
                    <div key={index} className={styles.line}>
                      {toSegments(line).map((segment, part) => (
                        <SegmentText key={part} segment={segment} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={styles.counts}>
            <span>{text.length} caracteres</span>
            <span>{lines.length} linhas</span>
          </div>
        </section>
      </div>

      <footer className={styles.actionsBar}>
        <div className={styles.actionsInner}>
          <button
            type="button"
            className={`${styles.copy} ${copy === 'copied' ? styles.copied : ''}`}
            onClick={copyMessage}
          >
            <Icon name={copy === 'copied' ? 'check' : 'copy'} size={20} />
            {copy === 'copied'
              ? 'Copiada! Agora é só colar no WhatsApp'
              : 'Copiar mensagem'}
          </button>
          <a
            className={styles.open}
            href={`https://wa.me/?text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="link" size={18} />
            Abrir no WhatsApp
          </a>
          <p className={styles.status} role="status">
            {copy === 'error' &&
              'Não foi possível copiar. Use “Texto puro” e copie manualmente.'}
            {copy === 'copied' && 'Mensagem copiada.'}
            {copy === 'idle' &&
              'A mensagem é copiada com os asteriscos e sublinhados. O WhatsApp transforma em negrito e itálico quando você envia.'}
          </p>
        </div>
      </footer>
    </main>
  )
}
