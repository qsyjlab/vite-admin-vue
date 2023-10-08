import { withInstall } from '@/utils'

import ProTableComponent from './src/pro-table.vue'

export const ProTable = withInstall(ProTableComponent)

export type { ProTableColumns, ProTableEditable } from './src/types'

export * from './src/use-pro-table'