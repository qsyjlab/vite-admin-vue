import { withInstall } from '@/utils'
import WatermarkComponent from './src/watermark.vue'

export const Watermark = withInstall(WatermarkComponent)

export { useWaterMark } from './src/use-watermark'
export type { WatermarkProps } from './src/use-watermark'
