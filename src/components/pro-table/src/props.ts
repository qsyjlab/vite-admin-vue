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
  /** 列状态配置 */
  columnsState: {
    type: definePropType<ColumnsState>(Object),
    default: () => ({})
  },
  /** 列配置 */
  columns: {
    type: definePropType<ProTableColumns>(Array),
    default: () => []
  },
  /** 数据 同 el-table data */
  data: {
    type: definePropType<any[]>(Array),
    default: () => []
  },
  border: {
    type: definePropType<boolean>(Boolean),
    default: true
  },
  /** 请求函数 */
  request: {
    type: definePropType<(...rest: any[]) => Promise<any>>(Function)
  },
  /** 外部请求参数 */
  params: {
    type: definePropType<Record<string | number, any>>(Object)
  },
  /** 最终请求结果处理 */
  transform: {
    type: definePropType<ProTableProps['transform']>(Function)
  },
  /** 最终请求参数处理 */
  transformParams: {
    type: definePropType<ProTableProps['transformParams']>(Function)
  },
  /** 分页组件相关 */
  pagination: {
    type: definePropType<ProTablePaginationConfig | boolean>([Object, Boolean]),
    default: true
  },
  /** 表格布局相关 */
  tableLayout: {
    type: definePropType<ProTableProps['tableLayout']>(String),
    default: 'fixed'
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  /** 是否是选择列 */
  checkable: {
    type: Boolean,
    default: false
  },
  reserveSelection: {
    type: Boolean,
    default: false
  },
  /** 工具栏选项 */
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
  /** 编辑相关配置 */
  editable: {
    type: definePropType<ProTableEditable>(Object)
  },
  // 是否总是显示 alert
  alwaysShowAlert: {
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
  [emitsEnums.PAGE_CHANGE]: (page: number, size: number) => !!size && !!page,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  'update:loading': (loading: boolean) => true,
  'update:selectedKeys': (keys: any[]) => !!keys,
  register: (instance: TableActionRef) => !!instance
}

export type ProTableEmits = typeof proTableEmits
