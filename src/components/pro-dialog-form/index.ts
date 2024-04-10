import { withInstall } from '@/utils'
import DialogForm from './src/pro-dialog-form.vue'

export const ProDialogForm = withInstall(DialogForm)

export type ProDialogFormInstance = InstanceType<typeof ProDialogForm>

export type { IDialogFormProps as ProDialogFormProps } from './src/types'

export default ProDialogForm
