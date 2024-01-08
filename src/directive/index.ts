import { App } from 'vue'
import { watermarkDirective } from './watermark'
import { contextMenuDirective } from './context-menu'

export default (app: App) => {
  app.directive('watermark', watermarkDirective)
  app.directive('contextmenu', contextMenuDirective)
}
