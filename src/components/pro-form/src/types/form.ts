import type { FormItemRule, ColProps } from 'element-plus'
import type { Component } from 'vue'

export interface FormSchema {
  label?: string
  el?: Component | string
  key: string
  attrs?: Record<string, any>
  rules?: FormItemRule[]
  col?: Partial<ColProps>
}
