import type { CSSProperties } from 'vue'

export type ProCodeEditorTheme = 'light' | 'dark' | 'auto'

export interface ProCodeEditorProps {
  modelValue?: string
  language?: string
  theme?: ProCodeEditorTheme
  readonly?: boolean
  disabled?: boolean
  lineNumbers?: boolean
  wordWrap?: boolean
  tabSize?: number
  placeholder?: string
  height?: string | number
  minHeight?: string | number
  maxHeight?: string | number
  autofocus?: boolean
  bodyStyle?: CSSProperties
}

export interface ProCodeEditorExpose {
  focus: () => void
  blur: () => void
  getValue: () => string
  setValue: (value: string) => void
  insertText: (value: string) => void
  selectAll: () => void
  getTextarea: () => HTMLTextAreaElement | undefined
}

export type ProCodeEditorInstance = ProCodeEditorExpose
