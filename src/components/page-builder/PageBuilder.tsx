import { useState } from 'react'
import { Link } from 'react-router'
import { getStoredJson, setStoredJson } from '../../lib/storage'
import { Button, spinnerClassName } from '../Button'
import { Icon } from '../Icon'
import { Segmented } from '../Segmented'
import styles from './PageBuilder.module.css'
import { PreviewDialog } from './PreviewDialog'
import type { PageModel } from './types'
import { usePageList } from './usePageList'
import type { Page, PageData } from './usePageList'

export type PageBuilderLabels = {
  unit: string
  unitPlural: string
  listTitle: string
  size: string
  exportLabel: string
  exportingLabel: string
  doneLabel: string
  hint: string
}

type PageBuilderProps = {
  title: string
  intro: string
  storageKey: string
  models: PageModel[]
  initial: string[]
  aspectRatio: string
  labels: PageBuilderLabels
  max?: number
  // Builds and downloads the file, returning its name.
  onExport: (pages: Page[]) => Promise<string>
}

type Tab = 'pages' | 'models' | 'edit'
type ExportState =
  | { status: 'idle' }
  | { status: 'working' }
  | { status: 'done'; fileName: string }
  | { status: 'error' }

export function PageBuilder({
  title,
  intro,
  storageKey,
  models,
  initial,
  aspectRatio,
  labels,
  max,
  onExport,
}: PageBuilderProps) {
  const byType = new Map(models.map((model) => [model.type, model]))
  const keyFor = (type: string) => `${storageKey}_${type}`

  const startingData = (model: PageModel): PageData =>
    model.persisted
      ? getStoredJson(keyFor(model.type), model.defaults())
      : model.defaults()

  const [state, dispatch] = usePageList(
    initial.map((type) => ({ type, data: startingData(byType.get(type)!) }))
  )
  const [chosen, setChosen] = useState(models[0].type)
  const [previewing, setPreviewing] = useState<PageModel | null>(null)
  const [tab, setTab] = useState<Tab>('pages')
  const [exportState, setExportState] = useState<ExportState>({
    status: 'idle',
  })

  const { pages } = state
  const total = pages.length
  const selected = pages[state.selected]
  const selectedModel = selected ? byType.get(selected.type) : undefined
  const chosenModel = byType.get(chosen)!
  const full = max !== undefined && total >= max

  function save(page: Page, data: PageData) {
    if (byType.get(page.type)?.persisted) {
      setStoredJson(keyFor(page.type), data)
    }
  }

  function update(patch: PageData) {
    if (!selected) {
      return
    }

    dispatch({ kind: 'update', index: state.selected, patch })
    save(selected, { ...selected.data, ...patch })
    setExportState({ status: 'idle' })
  }

  function restoreDefaults() {
    if (selected && selectedModel) {
      update(selectedModel.defaults())
    }
  }

  function add(model = chosenModel) {
    dispatch({
      kind: 'add',
      type: model.type,
      data: startingData(model),
      max,
    })
    setChosen(model.type)
    setTab('edit')
  }

  async function handleExport() {
    setExportState({ status: 'working' })

    try {
      setExportState({ status: 'done', fileName: await onExport(pages) })
    } catch {
      setExportState({ status: 'error' })
    }
  }

  return (
    <main className={styles.builder} data-tab={tab}>
      <div className={styles.pageHead}>
        <nav aria-label="Você está em" className={styles.breadcrumb}>
          <Link to="/">Ferramentas</Link>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>
        <h1 className={styles.pageTitle}>{title}</h1>
        <p className={styles.muted}>{intro}</p>
      </div>

      <div className={styles.tabs}>
        <Segmented
          label="Seções do editor"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'pages', label: capitalize(labels.unitPlural) },
            { value: 'models', label: 'Adicionar' },
            { value: 'edit', label: 'Editar' },
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
            <p className={styles.muted}>
              Escolha um e adicione. Pode repetir o mesmo modelo.
            </p>
          </div>
          <ul className={styles.modelList}>
            {models.map((model) => (
              <li key={model.type} className={styles.modelItem}>
                <button
                  type="button"
                  className={styles.model}
                  aria-pressed={model.type === chosen}
                  onClick={() => setChosen(model.type)}
                >
                  <span
                    className={styles.modelThumb}
                    style={{ aspectRatio }}
                    aria-hidden="true"
                  >
                    <model.Preview data={(model.sample ?? model.defaults)()} />
                  </span>
                  <span className={styles.modelText}>
                    <span className={styles.modelName}>
                      {model.name}
                      {model.persisted && (
                        <Icon
                          name="device"
                          size={13}
                          className={styles.saved}
                        />
                      )}
                    </span>
                    <span className={styles.modelDescription}>
                      {model.description}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.previewButton}
                  aria-label={`Ver preview: ${model.name}`}
                  onClick={() => setPreviewing(model)}
                >
                  <Icon name="eye" size={16} />
                  <span aria-hidden="true">Ver preview</span>
                </button>
              </li>
            ))}
          </ul>
          <Button large block disabled={full} onClick={() => add()}>
            <Icon name="plus" />
            Adicionar “{chosenModel.name}”
          </Button>
          {full && (
            <p className={styles.muted}>
              Chegou ao limite de {max} {labels.unitPlural}.
            </p>
          )}
          {models.some((model) => model.persisted) && (
            <p className={styles.note}>
              <Icon name="device" size={16} />
              {listNames(models.filter((model) => model.persisted))}{' '}
              {models.filter((model) => model.persisted).length > 1
                ? 'ficam salvos'
                : 'fica salvo'}{' '}
              neste aparelho e voltam quando você recarregar a página.
            </p>
          )}
        </aside>

        <section
          aria-labelledby="titulo-lista"
          className={`${styles.panel} ${styles.list}`}
        >
          <div className={styles.panelHead}>
            <h2 id="titulo-lista" className={styles.panelTitle}>
              {labels.listTitle}
            </h2>
            <span className={styles.muted}>
              {max ? `${total} de ${max}` : total} {labels.unitPlural}, nesta
              ordem
            </span>
          </div>

          {total === 0 && (
            <p className={styles.empty}>
              Está vazio. Escolha um modelo e clique em Adicionar.
            </p>
          )}

          <ol aria-label={labels.listTitle} className={styles.pages}>
            {pages.map((page, index) => {
              const model = byType.get(page.type)!
              const active = index === state.selected
              const number = index + 1

              return (
                <li
                  key={page.id}
                  className={`${styles.page} ${active ? styles.active : ''}`}
                >
                  <div className={styles.pageRow}>
                    <span className={styles.number} aria-hidden="true">
                      {number}
                    </span>
                    <button
                      type="button"
                      className={styles.pageButton}
                      aria-label={`Editar ${labels.unit} ${number}: ${model.name}`}
                      aria-current={active ? 'true' : undefined}
                      onClick={() => dispatch({ kind: 'select', index })}
                    >
                      <span
                        className={styles.pageThumb}
                        style={{ aspectRatio }}
                        aria-hidden="true"
                      >
                        <model.Preview data={page.data} />
                      </span>
                      <span className={styles.modelText}>
                        <span className={styles.modelName}>{model.name}</span>
                        <span className={styles.summary}>
                          {model.summary(page.data)}
                        </span>
                      </span>
                    </button>
                    <span className={styles.pageActions}>
                      <button
                        type="button"
                        className={styles.iconButton}
                        aria-label={`Subir ${labels.unit} ${number}`}
                        disabled={index === 0}
                        onClick={() =>
                          dispatch({ kind: 'move', index, by: -1 })
                        }
                      >
                        <Icon name="arrowUp" />
                      </button>
                      <button
                        type="button"
                        className={styles.iconButton}
                        aria-label={`Descer ${labels.unit} ${number}`}
                        disabled={index === total - 1}
                        onClick={() => dispatch({ kind: 'move', index, by: 1 })}
                      >
                        <Icon name="arrowDown" />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.danger}`}
                        aria-label={`Remover ${labels.unit} ${number}`}
                        onClick={() => dispatch({ kind: 'remove', index })}
                      >
                        <Icon name="trash" />
                      </button>
                    </span>
                  </div>
                  {active && (
                    <div className={styles.preview}>
                      <div className={styles.previewFrame}>
                        <model.Preview data={page.data} />
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </section>

        <aside
          aria-labelledby="titulo-edicao"
          className={`${styles.panel} ${styles.edit}`}
        >
          {selected && selectedModel ? (
            <>
              <div className={styles.editHead}>
                <div>
                  <span className={styles.muted}>
                    Editando a {labels.unit} {state.selected + 1} de {total}
                  </span>
                  <h2 id="titulo-edicao" className={styles.editTitle}>
                    {selectedModel.name}
                  </h2>
                </div>
                <Button
                  variant="secondary"
                  disabled={full}
                  onClick={() =>
                    dispatch({ kind: 'duplicate', index: state.selected, max })
                  }
                >
                  <Icon name="copy" size={16} />
                  Duplicar
                </Button>
              </div>
              <div className={styles.editPreview} aria-hidden="true">
                <selectedModel.Preview data={selected.data} />
              </div>
              {selectedModel.persisted && (
                <div className={styles.savedNote}>
                  <Icon name="device" size={16} />
                  <span>Salvo neste aparelho a cada mudança.</span>
                  <button type="button" onClick={restoreDefaults}>
                    Restaurar padrão
                  </button>
                </div>
              )}
              <selectedModel.Form
                key={selected.id}
                data={selected.data}
                onChange={update}
              />
            </>
          ) : (
            <>
              <h2 id="titulo-edicao" className="visually-hidden">
                Edição
              </h2>
              <p className={styles.muted}>
                Adicione uma {labels.unit} para editar o conteúdo dela aqui.
              </p>
            </>
          )}
        </aside>
      </div>

      {previewing && (
        <PreviewDialog
          model={previewing}
          aspectRatio={aspectRatio}
          canAdd={!full}
          onAdd={() => {
            add(previewing)
            setPreviewing(null)
          }}
          onClose={() => setPreviewing(null)}
        />
      )}

      <footer className={styles.exportBar}>
        <div className={styles.exportInner}>
          <div className={styles.exportText} role="status">
            {exportState.status === 'done' ? (
              <>
                <strong>{labels.doneLabel}</strong>
                <span>{exportState.fileName}</span>
              </>
            ) : exportState.status === 'error' ? (
              <>
                <strong>Não foi possível gerar o arquivo.</strong>
                <span>Tente de novo ou troque as imagens.</span>
              </>
            ) : (
              <>
                <strong>
                  {total} {labels.unitPlural} · {labels.size}
                </strong>
                <span>{labels.hint}</span>
              </>
            )}
          </div>
          <Button
            large
            disabled={total === 0 || exportState.status === 'working'}
            onClick={handleExport}
          >
            <Icon
              name={exportState.status === 'working' ? 'spinner' : 'download'}
              size={20}
              className={
                exportState.status === 'working' ? spinnerClassName : undefined
              }
            />
            {exportState.status === 'working'
              ? labels.exportingLabel
              : labels.exportLabel}
          </Button>
        </div>
      </footer>
    </main>
  )
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function listNames(models: PageModel[]) {
  const names = models.map((model) => model.name)

  return names.length > 1
    ? `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`
    : names[0]
}
