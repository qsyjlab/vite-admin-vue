import { definePropType } from '@/utils'

import type {
  ColumnsState,
  ProTableColumns,
  TableOptions,
  ProTableEditable,
  TableActionRef,
  ProTablePaginationConfig,
  ProTableProps
} from './types'

export const proTableProps = {
  headerTitle: String,
  size: {
    type: definePropType<ProTableProps['size']>(String)
  },
  columnsState: {
    type: definePropType<ColumnsState>(Object),
    default: () => ({})
  },
  columns: {
    type: definePropType<ProTableColumns>(Array),
    default: () => []
  },
  data: {
    type: definePropType<any[]>(Array),
    default: () => []
  },
  border: {
    type: definePropType<boolean>(Boolean),
    default: true
  },
  request: {
    type: definePropType<(...rest: any[]) => Promise<any>>(Function)
  },
  params: {
    type: definePropType<Record<string | number, any>>(Object)
  },
  pagination: {
    type: definePropType<ProTablePaginationConfig | boolean>([Object, Boolean]),
    default: true
  },
  tableLayout: {
    type: definePropType<ProTableProps['tableLayout']>(String),
    default: 'fixed'
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  checkable: {
    type: Boolean,
    default: false
  },
  reserveSelection: {
    type: Boolean,
    default: false
  },
  options: {
    type: definePropType<TableOptions>([Boolean, Object]),
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedKeys: {
    type: definePropType<any[]>(Array),
    default: () => []
  },
  editable: {
    type: definePropType<ProTableEditable>(Object),
    default: () => ({})
  }
}

export const emitsEnums = {
  PAGE_CHANGE: 'page-change'
} as const

// [Vue warn]:  Invalid event arguments: event validation failed for event
// so, A value must be returned
export const proTableEmits = {
  [emitsEnums.PAGE_CHANGE]: (page: number, size: number) => !!size && !!page,
  'update:loading': (loading: boolean) => true,
  'update:selectedKeys': (keys: any[]) => !!keys,
  register: (instance: TableActionRef) => !!instance
}

export type ProTableEmits = typeof proTableEmits
