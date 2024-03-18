import type { Component } from 'vue'
import type { FormValidateFailure } from 'element-plus'

export interface ProTableEditRowComponent {
  el: Component | string
  props?: Record<string, any>
  rules?: EditRowRule[]
}

export type EditableTableRowKey = string | number

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

export type EditableCellValidError = FormValidateFailure['fields'] | undefined
