import { withInstall } from '../shared/with-install'
import ProTableComponent from './pro-table.vue'

export const ProTable = withInstall(ProTableComponent)

export * from './pro-table'
export * from './pro-table-utils'
export * from './pro-table-editable-utils'
export * from './use-pro-table'

export default ProTable
