import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Button, spinnerClassName } from '../../components/Button'
import { TextAreaField, TextField } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { Toast } from '../../components/Toast'
import styles from './Editor.module.css'
import {
  EXPORT_HEIGHT,
  EXPORT_WIDTH,
  buildFileName,
  countTitleLines,
  downloadDataUrl,
  renderJpeg,
} from './exportImage'
import { PhotoInput } from './PhotoInput'
import { ThumbnailArt } from './ThumbnailArt'
import { TITLE_MAX_LENGTH, useThumbnailForm } from './useThumbnailForm'
import { YouTubeListPreview } from './YouTubeListPreview'

const MAX_TITLE_LINES = 2
const TOAST_DURATION = 4000

function describePosition(value: number) {
  if (value < 35) {
    return 'Mais acima'
  }

  if (value > 65) {
    return 'Mais abaixo'
  }

  return 'Centro'
}

// Uses the same line wrapping as the exported JPG.
function useTitleLines(title: string) {
  const [lines, setLines] = useState(0)

  useEffect(() => {
    let active = true

    countTitleLines(title)
      .then((count) => {
        if (active) {
          setLines(count)
        }
      })
      .catch(() => {
        // Without canvas or font loading the warning is just skipped.
      })

    return () => {
      active = false
    }
  }, [title])

  return lines
}

export function ThumbnailEditor() {
  const form = useThumbnailForm()
  const lines = useTitleLines(form.title)
  const [actualSize, setActualSize] = useState(false)
  const [rendering, setRendering] = useState(false)
  const [exportError, setExportError] = useState(false)
  const [downloadedFile, setDownloadedFile] = useState<string | null>(null)

  useEffect(() => {
    if (!downloadedFile) {
      return undefined
    }

    const timeout = window.setTimeout(
      () => setDownloadedFile(null),
      TOAST_DURATION
    )

    return () => window.clearTimeout(timeout)
  }, [downloadedFile])

  const art = {
    title: form.title,
    preacher: form.preacher,
    photo: form.photo?.src,
    photoPositionY: form.photoPositionY,
  }

  async function handleDownload() {
    setRendering(true)
    setExportError(false)

    try {
      const dataUrl = await renderJpeg(art)
      const fileName = buildFileName(form.title)

      downloadDataUrl(dataUrl, fileName)
      setDownloadedFile(fileName)
    } catch {
      setExportError(true)
    } finally {
      setRendering(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.pageHead}>
        <div>
          <nav aria-label="Você está em" className={styles.breadcrumb}>
            <Link to="/">Ferramentas</Link>
            <span aria-hidden="true">/</span>
            <span>Thumbnail para YouTube</span>
          </nav>
          <h1 className={styles.pageTitle}>Thumbnail para YouTube</h1>
        </div>
        <span className={styles.live}>
          <span className={styles.liveDot} aria-hidden="true" />
          Pré-visualização ao vivo
        </span>
      </div>

      <div className={styles.workspace}>
        <div className={styles.main}>
          <section aria-label="Pré-visualização" className={styles.stage}>
            <div className={styles.stageBar}>
              <span className={styles.stageSize}>
                {EXPORT_WIDTH} × {EXPORT_HEIGHT} px · JPG
              </span>
              <div className={styles.zoom}>
                <button
                  type="button"
                  aria-pressed={!actualSize}
                  onClick={() => setActualSize(false)}
                >
                  Ajustar à tela
                </button>
                <button
                  type="button"
                  aria-pressed={actualSize}
                  onClick={() => setActualSize(true)}
                >
                  Tamanho real
                </button>
              </div>
            </div>
            <div className={styles.canvas}>
              <div
                className={`${styles.artFrame} ${actualSize ? styles.actualSize : ''}`}
              >
                <ThumbnailArt {...art} />
              </div>
            </div>
          </section>

          <YouTubeListPreview {...art} photo={form.photo} />
        </div>

        <aside aria-label="Dados da thumbnail" className={styles.panel}>
          <h2 className={styles.panelTitle}>Dados da thumbnail</h2>

          <TextAreaField
            label="Título da mensagem"
            rows={2}
            value={form.title}
            maxLength={TITLE_MAX_LENGTH}
            hint="Até 2 linhas na arte fica melhor."
            onChange={(event) => form.update({ title: event.target.value })}
          />
          {lines > MAX_TITLE_LINES && (
            <p role="status" className={styles.warning}>
              <Icon name="warning" />
              O título ocupa {lines} linhas e pode cobrir o rosto. Tente
              encurtar.
            </p>
          )}

          <TextField
            label="Nome do pregador"
            value={form.preacher}
            hint="Inclua o tratamento: Pr., Ev., Ir., Dr."
            autoComplete="off"
            onChange={(event) => form.update({ preacher: event.target.value })}
          />

          <PhotoInput
            source={form.photoSource}
            url={form.photoUrl}
            photo={form.photo}
            error={form.photoError}
            onSourceChange={form.setPhotoSource}
            onUrlChange={(photoUrl) => form.update({ photoUrl })}
            onUrlSubmit={form.loadFromUrl}
            onFile={form.loadFromFile}
            onRemove={form.removePhoto}
          />

          {form.photo && (
            <div className={styles.slider}>
              <div className={styles.sliderHead}>
                <label htmlFor="enquadramento">Enquadramento</label>
                <span className={styles.muted}>
                  {describePosition(form.photoPositionY)}
                </span>
              </div>
              <input
                id="enquadramento"
                type="range"
                min="0"
                max="100"
                value={form.photoPositionY}
                aria-describedby="enquadramento-dica"
                onChange={(event) =>
                  form.update({ photoPositionY: Number(event.target.value) })
                }
              />
              <span id="enquadramento-dica" className={styles.muted}>
                Arraste para mostrar mais acima ou mais abaixo da foto.
              </span>
            </div>
          )}

          <div className={styles.actions}>
            <div className={styles.downloadBar}>
              <Button
                large
                block
                disabled={!form.canExport || rendering}
                onClick={handleDownload}
              >
                <Icon
                  name={rendering ? 'spinner' : 'download'}
                  size={20}
                  className={rendering ? spinnerClassName : undefined}
                />
                {rendering
                  ? 'Gerando imagem…'
                  : `Baixar JPG · ${EXPORT_WIDTH} × ${EXPORT_HEIGHT}`}
              </Button>
              {!form.canExport && (
                <span className={styles.muted}>
                  Preencha o título e o nome do pregador para baixar.
                </span>
              )}
              {exportError && (
                <span role="alert" className={styles.warning}>
                  <Icon name="alert" />
                  Não foi possível gerar a imagem. Tente de novo ou troque a
                  foto.
                </span>
              )}
            </div>
            <Button variant="ghost" onClick={form.clear}>
              Limpar campos
            </Button>
            <p className={styles.note}>
              <Icon name="lock" size={16} />A imagem é gerada no seu navegador.
              Os campos ficam salvos neste aparelho para a próxima vez.
            </p>
          </div>
        </aside>
      </div>

      {downloadedFile && (
        <Toast message="Thumbnail baixada" detail={downloadedFile} />
      )}
    </main>
  )
}
