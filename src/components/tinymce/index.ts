import { withInstall } from '@/utils'

import tinymceEditor from './src/editor.vue'

export const ProTinymce = withInstall(tinymceEditor)

export * from './src/props'
export * from './src/editor'
