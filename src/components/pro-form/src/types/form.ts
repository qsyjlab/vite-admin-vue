import type { FormItemRule, ColProps, FormContext } from 'element-plus'
import type { Component } from 'vue'

export interface FormSchema {
  label?: string
  el?: Component | string
  key: string
  attrs?: Record<string, any>
  rules?: FormItemRule[]
  col?: Partial<ColProps>
}

export type NOOP = () => void

export interface FormMethodsType {
  submit: NOOP
  validate: NOOP
  resetFields: NOOP
  clearValidate: FormContext['clearValidate']
  validateField: NOOP
  scrollToField: NOOP
  // 强制更新 数据
  forceUpdateModel: (model: Record<string, any>) => void
}
