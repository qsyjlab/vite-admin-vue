import { withInstall } from '@/utils'
import { defineAsyncComponent } from 'vue'

export const ProTinymce = withInstall(defineAsyncComponent(() => import('./src/editor.vue')))

export * from './src/props'
export * from './src/editor'
