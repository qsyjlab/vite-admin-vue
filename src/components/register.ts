/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-16 13:45:46
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-17 14:50:24
 * @FilePath: \vite-admin-vue\src\components\register.ts
 */
import type { App } from 'vue'
import * as components from './index'

export function registerGlobalComponent(app: App) {
  Object.keys(components).forEach(item => {
    const key = item as keyof typeof components
    app.component(components[key].name, components[key])
  })
}
