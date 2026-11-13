import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost'

type StyleOptions = {
  variant?: Variant
  large?: boolean
  block?: boolean
}

function buttonClassName({ variant = 'primary', large, block }: StyleOptions) {
  return [
    styles.button,
    styles[variant],
    large && styles.large,
    block && styles.block,
  ]
    .filter(Boolean)
    .join(' ')
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleOptions

export function Button({
  variant,
  large,
  block,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, large, block })}
      {...props}
    />
  )
}

type ButtonLinkProps = StyleOptions & {
  to: string
  children: ReactNode
}

export function ButtonLink({ to, children, ...options }: ButtonLinkProps) {
  const className = buttonClassName(options)

  if (to.startsWith('#')) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  )
}

export const spinnerClassName = styles.spin
