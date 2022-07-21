/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-16 13:45:46
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-21 09:48:42
 * @FilePath: \vite-admin-vue\src\components\register.ts
 */

import { defineAppPlugin } from '@/utils'
import * as components from './index'

export default defineAppPlugin(app => {
  Object.keys(components).forEach(item => {
    const key = item as keyof typeof components
    app.component(components[key].name, components[key])
  })
})
