import { ElTable } from 'element-plus'

import { NOOP } from './utils'

export type ColumnsMap = Record<string, any>

export interface ColumnsState {
  persistenceKey?: string
  persistenceType?: 'localStorage' | 'sessionStorage'
  value?: ColumnsMap
  change?: (map: ColumnsMap) => void
}

export type TableInstance = InstanceType<typeof ElTable>

export interface TableMethods {
  doLayout: TableInstance['doLayout']
  reload: NOOP
}
