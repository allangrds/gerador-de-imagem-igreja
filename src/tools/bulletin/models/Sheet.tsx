import type { ReactNode } from 'react'
import page from './Page.module.css'

type SheetProps = {
  className?: string
  children: ReactNode
}

export function Sheet({ className = '', children }: SheetProps) {
  return (
    <div className={page.page}>
      <div className={`${page.sheet} ${className}`}>{children}</div>
    </div>
  )
}
