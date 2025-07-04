import type { TableInstance } from 'element-plus'
import type { Component, VNode, Ref } from 'vue'
import type { UseColumnsMapReturn, UseEditableReturn } from '../hooks'
import type { EditRowRule, EditableCellState, EditableCellValidError } from './editable'
import type { TableColumnCtx, RenderRowData, TableProps } from 'element-plus'
import type { ValueEnum, ValueType } from './renderer'

export type ColumnsMap = Record<string, any>

export interface ProTableColumnItem<T = any>
  extends Partial<Omit<TableColumnCtx<T>, 'children' | 'label' | 'prop'>> {
  title?: number | string
  key: ColumnKey<T>
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
  render?: (scope: ProTableSlotScope<T>) => number | string | undefined | null | VNode | Component
}

export interface ProTableSlotScope<T = any> extends RenderRowData<T> {
  editableState: EditableCellState
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
  /**
   * 正确验证需要 el-form 包裹
   * 动态渲染验证
   */
  enableValidate?: boolean
  onSave?: (row: any, next: () => void) => void
  onCancel?: (row: any, next: () => void) => void
  onDelete?: (row: any, next: () => void) => void
  onChange?: (data: any[]) => void
  onError?: (errors: EditableCellValidError | undefined) => void
}

export type ProTableColumns<T = any> = ProTableColumnItem<T>[]

export type RowKey = ProTableProps['rowKey']

export type ColumnKey<T = any> = DeepKeyOf<T> | (string & {})

// 深度 keyof 类型
type DeepKeyOf<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${K & string}` | `${K & string}.${DeepKeyOf<T[K]>}`
        : `${K & string}`
    }[keyof T]
  : never

/** 列设置配置 */
export interface ColumnsState {
  persistenceKey?: string
  persistenceType?: 'localStorage' | 'sessionStorage'
  value?: ColumnsMap
  change?: (map: ColumnsMap) => void
}

export type { TableInstance }

/** 表格默认工具栏开关 */
interface ToolbarOptions {
  reload?: boolean
  setting?: boolean
  density?: boolean
}

export type TableOptions = boolean | ToolbarOptions

export interface TableActionRef {
  tableRef: Ref<TableInstance | null>
  clearSelectedKeys: () => void
  /** 重载列表 */
  reload: () => void
  /** 仅仅刷新 */
  refresh: () => void
  doHeight: () => void
  editableCellUtils: Omit<
    UseEditableReturn,
    'editableCellMap' | 'formInstanceRef' | 'editableRowsModel'
  >
  columnsSettingUtils: Omit<UseColumnsMapReturn, 'columnsMap' | 'defaultColumnsMap'>
}

export interface ProTablePaginationConfig {
  page?: number
  pageSize?: number
  layout?: string[]
  pageSizes?: number[]
  background?: boolean
}

/**
 * vue3.3+ 仍然不支持复杂的 ts 类型查询
 * export type ProTableProps = ExtractPropTypes<typeof proTableProps>
 *
 * 下面定义仅作用外部类型
 */
export interface ProTableProps<T = any> {
  headerTitle: string
  size: TableProps<T>['size']
  height?: string | number
  autoFitHeight: boolean
  columnsState: ColumnsState
  columns: ProTableColumns
  data: T[]
  border: boolean
  request: (...rest: any[]) => Promise<any>
  params: Record<string | number, any>
  pagination: ProTablePaginationConfig | boolean
  tableLayout: TableProps<T>['tableLayout']
  rowKey: TableProps<T>['rowKey']
  checkable: boolean
  reserveSelection: boolean
  options: TableOptions
  loading: boolean
  selectedKeys: any[]
  editable: ProTableEditable
  transform: (response: any) => { data: any[]; total: number }
  transformParams: (params: any) => any
  alwaysShowAlert: boolean
  showAlert: boolean
  autoRequest: boolean
  cacheSelectedData: T[]
  customRenderAfter: (value: unknown) => any
  indexBorder: ProTableIndexBorder
}

export type ProTableIndexBorder = boolean | ProTableIndexBorderProps

export interface ProTableIndexBorderProps<T = any> extends ProTableColumnItem<T> {
  _?: unknown
}

export interface ProTableHeaderProps {
  headerTitle: string
}

interface CustomRendererParams<T = any> {
  row: any
  value: any
  columnConfig: ProTableColumnItem<T>
  valueEnum: any
  valueType: any
  index: number
  pagination: any
}

export type CustomRendererFn = (params: CustomRendererParams) => any

export * from './editable'
export * from './renderer'
