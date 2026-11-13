import { qrPath } from '../qr'

type QrProps = {
  text: string
  label: string
  className?: string
}

export function Qr({ text, label, className }: QrProps) {
  const { size, path } = qrPath(text)

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      className={className}
    >
      <path d={path} fill="currentColor" />
    </svg>
  )
}
