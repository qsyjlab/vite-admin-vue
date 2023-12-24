import { withInstall } from '@/utils'

import ProTableComponent from './src/pro-table.vue'

export const ProTable = withInstall(ProTableComponent)

export type { ProTableColumns, ProTableEditable, EditableCellValidError } from './src/types'

export * from './src/use-pro-table'

export type ProTableInstance = InstanceType<typeof ProTable>
