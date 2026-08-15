import type { Ref } from 'vue'
import type {
  ProTableColumns,
  ProTableDragSortEnd,
  ProTableExpose,
  ProTableRowKey
} from '../pro-table'

export interface ProDragSortTableProps<TRecord extends object> {
  modelValue?: TRecord[]
  data?: TRecord[]
  columns?: ProTableColumns<TRecord>
  rowKey?: ProTableRowKey<TRecord>
  dragSortKey?: string
  animation?: number
  autoFitHeight?: boolean
  showDragColumn?: boolean
}

export interface ProDragSortTableExpose<TRecord extends object> {
  tableRef: Ref<ProTableExpose<TRecord> | null>
  data: Readonly<Ref<TRecord[]>>
}

export type ProDragSortTableInstance<TRecord extends object> = ProDragSortTableExpose<TRecord>

export type ProDragSortTableEnd<TRecord extends object> = ProTableDragSortEnd<TRecord>
