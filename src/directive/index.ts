import { App } from 'vue'

import { hasAuthDirective, hasRoleDirective } from './auth'

export default (app: App) => {
  app.directive('hasAuth', hasAuthDirective)
  app.directive('hasRole', hasRoleDirective)
}
