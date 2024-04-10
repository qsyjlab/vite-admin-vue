import { withInstall } from '@/utils'

import { defineAsyncComponent } from 'vue'

export const DocxPreview = withInstall(defineAsyncComponent(() => import('./src/docx-preview.vue')))

export default DocxPreview
