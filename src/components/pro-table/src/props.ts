import { definePropType } from '@/utils'
import type { ExtractPropTypes } from 'vue'
import type { TableProps } from 'element-plus'
import { ColumnsState, ProTableColumns, ProTableColumnItem, TableOptions } from './types'

export const proTableHeaderProps = {
  headerTitle: String
}

export const proTableProps = {
  size: {
    type: definePropType<TableProps<any>['size']>(String)
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
    type: Array,
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
  isPagination: {
    type: Boolean,
    default: true
  },
  tableLayout: {
    type: definePropType<'auto' | 'fixed'>(String),
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
    type: Array,
    default: () => []
  }
}

export const proTableColumnProps = {
  column: {
    type: definePropType<ProTableColumnItem>(Object),
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
  'update:selectedKeys': (keys: any[]) => !!keys
}

export type ProTableEmits = typeof proTableEmits

export type ProTableProps = ExtractPropTypes<typeof proTableProps>

export type ProTableHeaderProps = ExtractPropTypes<typeof proTableHeaderProps>
