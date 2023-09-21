import { withInstall } from '@/utils'

import ProTable from './src/pro-table.vue'

export const VProTable = withInstall(ProTable)

export type { ProTableColumns, ProTableEditable } from './src/types'

export * from './src/use-pro-table'
