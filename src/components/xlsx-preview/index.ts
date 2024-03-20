import { withInstall } from '@/utils'
import { defineAsyncComponent } from 'vue'

export const XlsxPreview = withInstall(defineAsyncComponent(() => import('./src/xlsx-preview.vue')))

export default XlsxPreview
