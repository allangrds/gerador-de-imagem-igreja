import { useId } from 'react'
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import styles from './Field.module.css'
import { Icon } from './Icon'

type FieldChrome = {
  label: string
  hint?: string
  error?: string
  maxLength?: number
}

function FieldMeta({
  hint,
  error,
  length,
  maxLength,
  hintId,
}: Omit<FieldChrome, 'label'> & { length: number; hintId: string }) {
  if (error) {
    return (
      <span id={hintId} className={styles.error}>
        <Icon name="alert" />
        {error}
      </span>
    )
  }

  if (!hint && !maxLength) {
    return null
  }

  return (
    <span className={styles.meta}>
      <span id={hintId}>{hint}</span>
      {maxLength && (
        <span className={length > maxLength ? styles.over : undefined}>
          {length} / {maxLength}
        </span>
      )}
    </span>
  )
}

type TextFieldProps = FieldChrome &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'maxLength'> & { value: string }

export function TextField({
  label,
  hint,
  error,
  maxLength,
  value,
  ...props
}: TextFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        className={styles.control}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={hint || error ? hintId : undefined}
        {...props}
      />
      <FieldMeta
        hint={hint}
        error={error}
        maxLength={maxLength}
        length={value.length}
        hintId={hintId}
      />
    </div>
  )
}

type TextAreaFieldProps = FieldChrome &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'maxLength'> & {
    value: string
  }

export function TextAreaField({
  label,
  hint,
  error,
  maxLength,
  value,
  ...props
}: TextAreaFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <textarea
        id={id}
        className={styles.control}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={hint || error ? hintId : undefined}
        {...props}
      />
      <FieldMeta
        hint={hint}
        error={error}
        maxLength={maxLength}
        length={value.length}
        hintId={hintId}
      />
    </div>
  )
}

type SelectFieldProps = Omit<FieldChrome, 'maxLength' | 'error'> &
  SelectHTMLAttributes<HTMLSelectElement> & {
    value: string
    options: string[]
  }

export function SelectField({
  label,
  hint,
  options,
  ...props
}: SelectFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select
        id={id}
        className={styles.control}
        aria-describedby={hint ? hintId : undefined}
        {...props}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <FieldMeta hint={hint} length={0} hintId={hintId} />
    </div>
  )
}
