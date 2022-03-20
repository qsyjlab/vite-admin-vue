/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-01-12 09:54:13
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-20 14:52:37
 */

import type { Component, Prop, PropType } from 'vue'
export interface FormType {
  label?: string
  key: string
  tag?: string | Component
  slot?: string
  attrs?: {
    [propName: string]: any
  }
  event?: {
    [propName: string]: any
  }
  rules?: {
    [propName: string]: any
  }
}

export enum EmitEnum {
  Submit = 'submit',
  Cancel = 'cancel'
}

type FormSize = 'large' | 'default' | 'small'

// interface propsType {
//   inline: boolean
//   form: formType[]
//   size: 'large' | 'default' | 'small'
//   defaultValue: { [propName: string]: any }
//   extraFixed: 'left' | 'right'
//   confirmText: string
//   cancelText: string
//   confirmButton: boolean
//   cancelButton: boolean
// }

// interface methodsType {
//   handlieReSet: () => void
//   handleSearch: () => void
//   getValue: () => void
//   handlePlaceholder: ComputedRef<(item: formType) => boolean | string>
// }

export const buildProps = {
  // layout 横列 竖列
  inline: {
    type: Boolean,
    default: false
  },
  // 表单对象
  form: {
    type: Array as PropType<FormType[]>,
    required: true,
    default: () => []
  },

  // 表单及按钮统一大小
  size: {
    type: String as PropType<FormSize>,
    validator: (value: string) => {
      return ['large', 'default', 'small'].includes(value)
    },
    default: 'default'
  },
  // 默认值 单项数据
  defaultValue: {
    type: Object,
    default: () => ({})
  },
  // left|right
  extraFixed: {
    type: String,
    validator: (value: string) => {
      return ['right', 'left'].includes(value)
    },
    default: 'right'
  },
  // 确认按钮文字
  confirmText: String,
  // 取消按钮文字
  cancelText: String,
  confirmButton: {
    type: Boolean,
    default: true
  },
  cancelButton: {
    type: Boolean,
    default: true
  }
}

/**
 * 类型转换
 * @param form
 * @returns
 */
export const defineFormFields = (form: FormType[] | never) => form
