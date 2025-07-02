import { withInstall } from '@/utils'

import ProTableComponent from './src/pro-table.vue'
import type { ComponentExposed } from 'vue-component-type-helpers'

export const ProTable = withInstall(ProTableComponent)

export type { ProTableColumns, ProTableEditable, EditableCellValidError } from './src/types'

export * from './src/use-pro-table'

/**
 * 针对泛型类组件相关问题
 * https://github.com/vuejs/language-tools/issues/3206
 */
export type ProTableInstance<T = any> = ComponentExposed<typeof ProTable<T>>

export default ProTable
