import { ElTable } from 'element-plus'

import { Component, SetupContext, VNode } from 'vue'
import { ProTableEmits } from '../props'
import type { UseColumnsMapReturn, UseEditableReturn } from '../hooks'
import type { EditRowRule, EditableCellValidError } from './editable'
import type { TableColumnCtx } from 'element-plus'
import type { ValueEnum, ValueType } from './renderer'
import type { NOOP } from './utils'
import { Ref } from 'vue'

export type ColumnsMap = Record<string, any>

export interface ProTableColumnItem<T = any>
  extends Partial<Omit<TableColumnCtx<T>, 'children' | 'label' | 'prop'>> {
  title: number | string
  key: number | string
  /** 创建一个提示图标 */
  tip?: string
  /** 当前数值类型 default: text */
  valueType?: ValueType
  /** 数值枚举 */
  valueEnum?: ValueEnum
  /** 是否可编辑 */
  editable?: boolean
  /** 编辑列组件配置 */
  rowComponent?: ProTableEditRowComponent
  /** 子集表头 */
  children?: ProTableColumnItem<T>[]
  /** 函数式渲染器 优先级小于 slot */
  render?: (row: T, column: any) => number | string | undefined | null | VNode | Component
}

/** 编辑列表单属性 */
export interface ProTableEditRowComponent {
  el: Component | string
  props?: Record<string, any>
  rules?: EditRowRule[]
}

/** 编辑表格配置 */
export interface ProTableEditable {
  mode?: 'single' | 'multiple'
  onSave?: (row: any, next: () => void) => void
  onCancel?: (row: any, next: () => void) => void
  onDelete?: (row: any, next: () => void) => void
  onChange?: (data: any[]) => void
  onError?: (errors: EditableCellValidError | undefined) => void
}

export type ProTableColumns<T = any> = ProTableColumnItem<T>[]

export type RowKey = number | string

/** 列设置配置 */
export interface ColumnsState {
  persistenceKey?: string
  persistenceType?: 'localStorage' | 'sessionStorage'
  value?: ColumnsMap
  change?: (map: ColumnsMap) => void
}

export type TableInstance = InstanceType<typeof ElTable>

/**
 * 即将废弃 由 TableActionRef 来代替
 * @deprecated
 */
export interface TableExpose {
  doLayout: TableInstance['doLayout']
  reload: NOOP
  startEditable: (rowKey: string) => void
  cancelEditable: (rowKey: string) => void
  saveEditRow: (rowKey: string) => void
  deleteEditRow: (rowKey: string) => void
}

/** 表格默认工具栏开关 */
interface ToolbarOptions {
  reload?: boolean
  setting?: boolean
  density?: boolean
}

export type TableOptions = boolean | ToolbarOptions

export interface TableActionRef {
  tableRef: Ref<TableInstance | null>
  emits: SetupContext<ProTableEmits>['emit']
  clearSelection: TableInstance['clearSelection']
  /** 重载列表 */
  reload: () => void
  /** 仅仅刷新 */
  refresh: () => void
  toggleRowSelection: TableInstance['toggleRowSelection']
  editableCellUtils: Omit<UseEditableReturn, 'editableCellMap'>
  columnsSettingUtils: Omit<UseColumnsMapReturn, 'columnsMap' | 'defaultColumnsMap'>
}

export interface ProTablePaginationConfig {
  page?: number
  pageSize?: number
  layout?: string[]
  pageSizes?: number[]
  background?: boolean
}

export * from './editable'
export * from './renderer'
