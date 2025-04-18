import { definePropType } from '@/utils'

import type {
  ColumnsState,
  TableOptions,
  ProTableEditable,
  TableActionRef,
  ProTablePaginationConfig,
  ProTableProps
} from './types'

export const proTableProps = {
  headerTitle: String,
  height: {
    type: definePropType<ProTableProps['height']>([Number, String])
  },
  size: {
    type: definePropType<ProTableProps['size']>(String)
  },
  indexBorder: {
    type: definePropType<ProTableProps['indexBorder']>([Boolean, Object]),
    default: true
  },
  /** 列状态配置 */
  columnsState: {
    type: definePropType<ColumnsState>(Object),
    default: () => ({})
  },

  border: {
    type: definePropType<boolean>(Boolean),
    default: true
  },
  /** 请求函数 */
  request: {
    type: definePropType<(...rest: any[]) => Promise<any>>(Function)
  },

  /** 最终请求结果处理 */
  transform: {
    type: definePropType<ProTableProps['transform']>(Function)
  },
  /** 最终请求参数处理 */
  transformParams: {
    type: definePropType<ProTableProps['transformParams']>(Function)
  },
  /** 最终请求参数处理 */
  customRenderAfter: {
    type: definePropType<ProTableProps['customRenderAfter']>(Function)
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
  /** 跨页选择回显用 */
  cacheSelectedData: {
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
  },
  showAlert: {
    type: Boolean,
    default: true
  },
  /** 是否自适应高度 */
  autoFitHeight: {
    type: Boolean,
    default: false
  },
  /** 自动请求 */
  autoRequest: {
    type: Boolean,
    default: true
  }
}

// [Vue warn]:  Invalid event arguments: event validation failed for event
// so, A value must be returned
export const proTableEmits = {
  'page-change': (page: number, size: number) => !!size && !!page,

  'update:loading': (loading: boolean) => true,
  'update:selectedKeys': (keys: any[]) => !!keys,
  'selection-change': selection => !!selection,
  register: (instance: TableActionRef) => !!instance
}

export type ProTableEmits = typeof proTableEmits
