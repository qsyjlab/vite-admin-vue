import { definePropType } from '@/utils'
import type { ExtractPropTypes } from 'vue'

export interface ProTableColumnItem {
  title: number | string
  key: number | string
}

export type ProTableColumns = ProTableColumnItem[]

export const proTableHeaderProps = {
  headerTitle: String
}

export const proTableProps = {
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
  }
}

export const emitsEnums = {
  PAGE_CHANGE: 'page-change'
} as const

// [Vue warn]:  Invalid event arguments: event validation failed for event
// so, A value must be returned
export const proTableEmits = {
  [emitsEnums.PAGE_CHANGE]: (page: number, size: number): boolean => !!size && !!page
}

export type ProTableProps = ExtractPropTypes<typeof proTableProps>

export type ProTableHeaderProps = ExtractPropTypes<typeof proTableHeaderProps>
