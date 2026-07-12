import type { TreeKey } from 'element-plus/es/components/tree/src/tree.type'
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
}

export interface ProTreeExpose<TNode extends object> {
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
