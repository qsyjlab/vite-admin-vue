import { withInstall } from '@/utils'

import PreviewFile from './src/preview-file.vue'

export const ProPreviewFile = withInstall(PreviewFile)

export type ProPreviewFileInstance = InstanceType<typeof ProPreviewFile>

export default ProPreviewFile
