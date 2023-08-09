import { App } from 'vue'

import { hasAuthDirective, hasRoleDirective } from './auth'
import { watermarkDirective } from './watermark'

export default (app: App) => {
  app.directive('hasAuth', hasAuthDirective)
  app.directive('hasRole', hasRoleDirective)
  app.directive('watermark', watermarkDirective)
}
