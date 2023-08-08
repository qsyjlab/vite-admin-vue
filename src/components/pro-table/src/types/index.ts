import { ElTable } from 'element-plus'
import type { TableColumnCtx, TableProps } from 'element-plus'
import { NOOP } from './utils'
import { Component, VNode } from 'vue'

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
  valueEnum?: valueEnum
  children?: ProTableColumnItem<T>[]
  render?: (row: T, column: any) => string | undefined | null | VNode | Component
}

export type ProTableColumns = ProTableColumnItem[]

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

export type ValueType = 'text' | 'enum'

export type valueEnum =
  | Record<string, valueEnumValue>
  | ((rowData: any) => Record<string, valueEnumValue>)
export type valueEnumValue = {
  text?: string
  color?: string
}
