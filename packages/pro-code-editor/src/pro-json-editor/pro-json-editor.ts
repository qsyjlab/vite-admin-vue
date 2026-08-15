import type { ProCodeEditorProps } from '../pro-code-editor'

export type ProJsonValue = object | unknown[] | string | number | boolean | null
export type ProJsonEditorMode = 'object' | 'string'

export interface ProJsonEditorError {
  message: string
  line?: number
  column?: number
  position?: number
}

export interface ProJsonEditorProps extends Omit<ProCodeEditorProps, 'language' | 'modelValue'> {
  modelValue?: ProJsonValue
  mode?: ProJsonEditorMode
  indent?: number
  sortKeys?: boolean
  validateOnChange?: boolean
}

export interface ProJsonEditorExpose {
  focus: () => void
  blur: () => void
  getValue: () => ProJsonValue | undefined
  getText: () => string
  setValue: (value: ProJsonValue) => void
  validate: () => boolean
  format: () => boolean
  minify: () => boolean
  getError: () => ProJsonEditorError | undefined
}

export type ProJsonEditorInstance = ProJsonEditorExpose
