import type { FormItemRule, ColProps, FormContext, FormItemProps } from 'element-plus'
import type { Component } from 'vue'
import type { FormProps as EpFormProps } from 'element-plus'

export interface FormSchema extends Partial<Pick<FormItemProps, 'labelWidth' | 'size'>> {
  /** 标题 */
  label?: string
  /** 组件或者全局组件 */
  el?: Component | string
  /** 唯一字段 */
  key: string
  /** tooltip 提示 */
  tip?: string
  /** 是否充满 content */
  fill?: boolean
  /** 是否必填 */
  required?: boolean
  // 验证失败信息
  requiredMessage?: string
  /**
   * 是否显示在表单上
   * @default true
   */
  show?: boolean | ((value: any, values: Record<string, any>) => boolean)
  disabled?: boolean | ((value: any, values: Record<string, any>) => boolean)
  /** 组件属性 */
  attrs?: Record<string, any>
  /** 组件事件 */
  events?: Record<string, any>
  /** 组件验证规则 */
  rules?: FormItemRule[]
  /** grid 布局 属性 */
  col?: Partial<ColProps>
}

export type NOOP = () => void

export interface FormMethodsType {
  validate: (handle?: (model: Record<string, any>) => void) => void
  resetFields: NOOP
  clearValidate: FormContext['clearValidate']
  validateField: NOOP
  scrollToField: NOOP
  // 强制更新 数据
  forceUpdateModel: (model: Record<string, any>) => void
  setFieldValue: (key: string, value: any) => void
  getFieldValue: (key: string) => void
}

export interface ProFormProps extends EpFormProps {
  fields: FormSchema[]
}
