/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-01-07 14:14:17
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 22:24:13
 */

import type { PropType } from 'vue'

export enum TableEmits {
  UpdateIsRelaod = 'update:isReload',
  UpdateSelectKeys = 'update:selectedKeys',
  Select = 'select'
}

type IndexType = {
  title?: string
  width?: number
}

interface ColumnsType {
  title: string
  key: string
  [propsName: string]: any
}

export type SelectKeysType = number[] | string[] | []
export interface TableRactiveType {
  tableData: any[]
  currentPage: number
  query: {
    page_num: number
    page_size: number
  }
  total: number
  loading: boolean
  selectionkeys: SelectKeysType
}

interface ConfigDataType {
  index: IndexType
  noIndex: boolean
  columns: ColumnsType[]
  pagination: PaginationType
}

// columns type index default config
export const indexDefaultConfig = {
  width: 60,
  align: 'center',
  label: '索引'
}

interface PaginationType {
  pageSize: number
  pageSizes?: number[]
  layout: string[] | []
  total: number
}

// pagination default config
export const paginationDefaultConfig: PaginationType = {
  layout: ['total', 'sizes', 'prev', 'pager', 'next', 'jumper'],
  pageSize: 10,
  pageSizes: [10, 20, 30, 40],
  total: 0
}

// props
export const buildProps = {
  // 序号列
  index: {
    type: [Object] as PropType<IndexType>,
    default: () => ({})
  },
  // 更推荐的配置表格方式
  configData: {
    type: Object as PropType<ConfigDataType>,
    default: () => ({})
  },
  // 表格列
  columns: {
    type: Array as PropType<ColumnsType[]>,
    default: () => []
  },
  // get 参数
  params: {
    type: Object,
    default: () => ({})
  },
  // 数据
  data: {
    type: Array,
    default: () => []
  },
  // 删除
  delHttp: Function,

  // http 请求
  http: Function,
  // 获取到的数据格式处理
  handler: {
    type: Function,
    default: (val: any): any => val
  },
  // 分页配置
  pagination: {
    type: [Object] as PropType<PaginationType>,
    default: () => ({
      pageSize: 10,
      layout: ['total', 'sizes', 'prev', 'pager', 'next', 'jumper'].join(',')
    })
  },
  // 指定 行id名称
  rowId: {
    type: String,
    default: 'id'
  },
  // tree props
  treeProps: {
    type: Object,
    default: () => ({})
  },
  // 是否需要 checkbox多选
  isCheckBox: Boolean,
  // 刷新
  isReload: {
    type: Boolean,
    default: false
  },
  // 选中的列id
  selectedKeys: Array as PropType<SelectKeysType>,
  tooltipEffect: {
    type: String,
    default: 'dark'
  }
}

// 识别 ts 类型
export const defineColumns = (col: ColumnsType[]): ColumnsType[] => col
