import type { ComponentType } from 'react'
import type { PageData } from './usePageList'

export type ModelProps<D> = { data: D }

export type FormProps<D> = {
  data: D
  onChange: (patch: Partial<D>) => void
}

export type PageModel<D = PageData> = {
  type: string
  name: string
  description: string
  // Saved on this device and restored the next time the model is added.
  persisted?: boolean
  defaults: () => D
  // Example content for the model list and the bigger preview; falls back to defaults.
  sample?: () => D
  summary: (data: D) => string
  Preview: ComponentType<ModelProps<D>>
  Form: ComponentType<FormProps<D>>
}

// Lets each model keep its own data type inside a list of mixed models.
export function defineModel<D extends PageData>(model: PageModel<D>) {
  return model as unknown as PageModel
}
