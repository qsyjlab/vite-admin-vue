/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-16 13:45:46
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 14:12:50
 * @FilePath: \vite-admin-vue\src\components\register.ts
 */
import type { App } from 'vue'
import * as components from './index'

console.log(',', components)
console.log('Object.keys(components)', Object.keys(components))

export function registerGlobalComponent(app: App) {
  Object.keys(components).forEach(item => {
    const key = item as keyof typeof components
    app.component(components[key].name, components[key])
  })
}
