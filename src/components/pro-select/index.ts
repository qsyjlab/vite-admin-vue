import { withInstall } from '@/utils'
import ProSelectComponent from './src/pro-select.vue'

export const ProSelect = withInstall(ProSelectComponent)

export type ProSelectInstance = InstanceType<typeof ProSelect>

export default ProSelect
