import { withInstall } from '@/utils'

import ProTable from './src/pro-table.vue'

export const VProTable = withInstall(ProTable)

export type { ProTableColumns } from './src/types'