import { withInstall } from '../shared/with-install'
import ProTreeComponent from './pro-tree.vue'
import ProTreeSelectComponent from './pro-tree-select.vue'
export const ProTree = withInstall(ProTreeComponent)
export const ProTreeSelect = withInstall(ProTreeSelectComponent)
export * from './pro-tree'
