import { withInstall } from '../shared/with-install'
import Form from './src/base-form.vue'
import FormItem from './src/form-item.vue'

export const ProForm = withInstall(Form, {
  FormItem
})

export type ProFormInstance<TModel extends FormModel = FormModel> = FormMethodsType<TModel>
export type ProFormItemInstance = typeof FormItem

export * from './src/types'
export * from './src/use-pro-form'
export * from './src/use-pro-form-dirty-guard'
export * from './src/use-pro-form-container'
export * from './src/pro-form-container'
export * from './src/form-values'
export * from './src/form-errors'
export * from './src/use-collapse'

import type { FormMethodsType, FormModel } from './src/types'
