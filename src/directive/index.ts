import { App } from 'vue'
import { watermarkDirective } from './watermark'

export default (app: App) => {
  app.directive('watermark', watermarkDirective)
}
