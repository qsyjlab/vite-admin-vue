import type { TreeKey } from 'element-plus/es/components/tree/src/tree.type'
import type {
  ProRequestContext,
  ProRequestControl,
  ProRequestExecuteOptions,
  ProRequestLifecycle
} from '../shared/pro-request'
export interface ProTreeFields<TNode extends object> {
  key: keyof TNode | string
  label: keyof TNode | string
  children: keyof TNode | string
  disabled: keyof TNode | string
}

export interface ProTreeProps<TNode extends object> {
  data?: TNode[]
  fields?: Partial<ProTreeFields<TNode>>
  nodeKey?: string
  modelValue?: TreeKey[]
  currentKey?: TreeKey
  checkable?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  defaultExpandAll?: boolean
  expandOnClickNode?: boolean
  lazy?: boolean
  load?: (node: unknown, resolve: (data: TNode[]) => void) => void
  filter?: (keyword: string, data: TNode) => boolean
  loading?: boolean
  request?: (context: ProRequestContext) => Promise<TNode[]>
  requestDebounce?: number
  requestRetry?: number
  requestRetryDelay?: ProRequestExecuteOptions['retryDelay']
  emptyText?: string
  errorText?: string | ((error: unknown) => string)
  retryText?: string
}

export type ProTreeRequestLifecycle = ProRequestLifecycle

export interface ProTreeExpose<TNode extends object> extends ProRequestControl<TNode[]> {
  getTree: () => import('element-plus').TreeInstance | undefined
  getData: () => TNode[]
  reload: () => Promise<TNode[]>
  filter: (keyword: string) => void
  getCheckedKeys: () => TreeKey[]
  getCheckedNodes: () => TNode[]
  setCheckedKeys: (keys: TreeKey[]) => void
  getCurrentKey: () => TreeKey | undefined
  setCurrentKey: (key?: TreeKey) => void
  expandAll: () => void
  collapseAll: () => void
}

export type ProTreeInstance<TNode extends object> = ProTreeExpose<TNode>

export type ProTreeSelectValue = TreeKey | TreeKey[]

export interface ProTreeSelectProps<TNode extends object> {
  modelValue?: ProTreeSelectValue
  data?: TNode[]
  cacheData?: TNode[]
  fields?: Partial<ProTreeFields<TNode>>
  nodeKey?: string
  multiple?: boolean
  checkStrictly?: boolean
  lazy?: boolean
  load?: (node: unknown, resolve: (data: TNode[]) => void) => void
  loading?: boolean
  request?: (context: ProRequestContext) => Promise<TNode[]>
  pathRequest?: (value: ProTreeSelectValue, context: ProRequestContext) => Promise<TNode[]>
}

export interface ProTreeSelectExpose<TNode extends object> extends ProRequestControl<TNode[]> {
  getData: () => TNode[]
  getCacheData: () => TNode[]
  reload: () => Promise<TNode[]>
  reloadPath: () => Promise<TNode[]>
}

export type ProTreeSelectInstance<TNode extends object> = ProTreeSelectExpose<TNode>
