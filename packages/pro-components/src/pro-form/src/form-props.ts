import type { FormModel, FormSchema, ProFormCollapsedRows, ProFormProps } from './types/form'

export const emitsEnums = {
  SUBMIT: 'submit',
  RESET: 'reset',
  EFFECT: 'effect',
  UPDATE_COLLAPSED: 'update:collapsed',
  COLLAPSE: 'collapse',
  UPDATE_LOADING: 'update:loading',
  UPDATE_DIRTY: 'update:dirty',
  SUBMIT_SUCCESS: 'submit-success',
  SUBMIT_ERROR: 'submit-error',
  REQUEST_ERROR: 'request-error'
} as const

export type FormEmit<TModel extends FormModel> = {
  (event: 'submit' | 'reset', values: TModel): void
  (event: 'effect', newValue: TModel, oldValue: TModel): void
  (event: 'update:collapsed' | 'collapse', collapsed: boolean): void
  (event: 'update:loading' | 'update:dirty', value: boolean): void
  (event: 'submit-success', values: TModel): void
  (event: 'submit-error', error: unknown): void
  (event: 'request-error', error: unknown): void
}

export type NormalizedFormProps<TModel extends FormModel> = ProFormProps<TModel> & {
  fields: FormSchema<TModel>[]
  model: TModel
  inline: boolean
  layout: boolean
  enableEffect: boolean
  collapsible: boolean
  defaultCollapsed: boolean
  collapsedRows: ProFormCollapsedRows
  expandOnInvalid: boolean
  autoRequest: boolean
}
