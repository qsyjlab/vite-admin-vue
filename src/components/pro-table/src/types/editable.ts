import type { Component } from 'vue'

export interface ProTableEditRowComponent {
  el: Component | string
  props?: Record<string, any>
  rules?: EditRowRule[]
}

export interface EditRowRule {
  required?: boolean
  message?: string
  validator?: (value: any, row: any, callback: (error?: string | Error) => void) => void
}

export interface EditableCellState {
  isEdit: boolean
  data: any
  errors: EditableCellValidError
}

export type EditableCellValidError = Record<string, { message: string }>
