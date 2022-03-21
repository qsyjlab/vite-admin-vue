/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-21 16:15:39
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 17:16:10
 * @FilePath: \vite-admin-vue\src\directive\index.ts
 */

import { App } from 'vue'

import { hasAuthDirective, hasRoleDirective } from './auth'

export default (app: App) => {
  app.directive('hasAuth', hasAuthDirective)
  app.directive('hasRole', hasRoleDirective)
}
