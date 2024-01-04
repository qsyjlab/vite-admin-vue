import ContextMenuComponent from './src/context-menu.vue'
import { withInstall } from '@/utils'

export const ProContextMenu = withInstall(ContextMenuComponent)

export type { ProContextMenuItem } from './src/types'
