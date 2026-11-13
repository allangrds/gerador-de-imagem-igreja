import { useEffect, useRef, useState } from 'react'
import type { PageData } from '../../../components/page-builder/usePageList'
import styles from './ArtCanvas.module.css'
import { agendaArt, loadArt } from '.'

type ArtCanvasProps = {
  type: string
  data: PageData
}

// The preview is the same drawing as the JPG, painted at the size it is shown.
export function ArtCanvas({ type, data }: ArtCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const canvas = ref.current!
    const measure = () =>
      setWidth(Math.round(canvas.clientWidth * window.devicePixelRatio))

    measure()

    if (typeof ResizeObserver === 'undefined') {
      return
    }

    const observer = new ResizeObserver(measure)
    observer.observe(canvas)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!width) {
      return
    }

    let active = true

    loadArt(type, data)
      .then((paint) => {
        if (active && ref.current) {
          paint(ref.current, width)
        }
      })
      .catch(() => {
        // Without canvas the preview just stays blank; the download reports its own errors.
      })

    return () => {
      active = false
    }
  }, [type, data, width])

  return (
    <canvas
      ref={ref}
      className={styles.canvas}
      role="img"
      aria-label={agendaArt[type].label(data)}
    />
  )
}
