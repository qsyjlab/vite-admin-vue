import { withInstall } from '@/utils'
import { defineAsyncComponent } from 'vue'

export const PdfPreview = withInstall(defineAsyncComponent(() => import('./src/pdf-preview.vue')))

export default PdfPreview
