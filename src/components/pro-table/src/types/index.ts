import { ElTable } from 'element-plus'
import type { FormItemRule, TableColumnCtx } from 'element-plus'
import { NOOP } from './utils'
import { Component, SetupContext, VNode } from 'vue'
import { ProTableEmits } from '../props'
import { UseColumnsMapReturn, UseEditableReturn } from '../hooks'

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
  rules?: Omit<FormItemRule, 'trigger'>[]
}

/** 编辑表格配置 */
export interface ProTableEditable {
  mode?: 'single' | 'multiple'
  onSave?: (row: any, next: () => void) => void
  onCancel?: (row: any, next: () => void) => void
  onDelete?: (row: any, next: () => void) => void
  onChange?: (data: any[]) => void
}

export type ProTableColumns<T = any> = ProTableColumnItem<T>[]

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

export type ValueType = ValueTypeVal | (() => ValueTypeVal)

export type ValueTypeVal = 'text' | 'enum' | { type?: string; status?: string }

export type ValueEnum = ValueEnumRecord | ((rowData: any) => ValueEnumRecord | ValueEnumMap)

export type ValueEnumMap = Map<string | number | boolean, ValueEnumRecord>
export type ValueEnumRecord = Record<string, ValueEnumValue>

export type ValueEnumValue = {
  text?: string
  color?: string
}

/** 表格默认工具栏开关 */
interface ToolbarOptions {
  fullScreen?: boolean
  reload?: boolean
  setting?: boolean
  density?: boolean
}

export type TableOptions = boolean | ToolbarOptions

export interface TableActionRef {
  emits: SetupContext<ProTableEmits>['emit']
  clearSelection: TableInstance['clearSelection']
  toggleRowSelection: TableInstance['toggleRowSelection']
  editableCellUtils: Omit<UseEditableReturn, 'editableCellMap'>
  columnsSettingUtils: Omit<UseColumnsMapReturn, 'columnsMap' | 'defaultColumnsMap'>
}
