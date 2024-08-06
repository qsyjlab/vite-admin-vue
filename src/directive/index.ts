import { WatermarkDirective } from './watermark'
import { ContextMenuDirective } from './context-menu'
import { defineAppPlugin } from '@/utils'

export { WatermarkDirective, ContextMenuDirective }

export default defineAppPlugin(app => {
  app.directive('watermark', WatermarkDirective)
  app.directive('contextmenu', ContextMenuDirective)
})
