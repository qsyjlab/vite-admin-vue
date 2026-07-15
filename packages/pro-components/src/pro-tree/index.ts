import { withInstall } from '../shared/with-install'
import ProTreeComponent from './pro-tree.vue'
import ProTreeSelectComponent from './pro-tree-select.vue'
export const ProTree = withInstall(ProTreeComponent)
export const ProTreeSelect = withInstall(ProTreeSelectComponent)
export * from './pro-tree'
export * from './pro-tree-select-utils'
export * from './use-pro-tree'
export * from './use-pro-tree-select'
