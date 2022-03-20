/*
 * @Description: elementplus entry
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 14:11:59
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-20 20:19:52
 * @FilePath: \vite-admin-vue\src\plugins\elementPlus\index.ts
 */

import './source'
import * as components from './components'
import type { App } from 'vue'

export default (app: App) => {
  Object.entries(components).forEach(([key, value]) => {
    app.component(key, value)
  })
}
