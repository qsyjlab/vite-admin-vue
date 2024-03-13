import { withInstall } from '@/utils'
import Form from './src/base-form.vue'
import FormItem from './src/form-item.vue'

export const ProForm = withInstall(Form, {
  FormItem
})

export type ProFormInstance = InstanceType<typeof ProForm>
export type ProFormItemInstance = InstanceType<typeof FormItem>

export * from './src/types'
export * from './src/use-pro-form'
