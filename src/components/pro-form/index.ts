import { withInstall } from '@/utils'
import Form from './src/base-form.vue'
import FormItem from './src/form-action.vue'

export const ProForm = withInstall(Form)
export const ProFormItem = withInstall(FormItem)

export type ProFormInstance = InstanceType<typeof ProForm>
export type ProFormItemInstance = InstanceType<typeof ProFormItem>

export * from './src/extension'

export * from './src/types'
export * from './src/use-pro-form'
