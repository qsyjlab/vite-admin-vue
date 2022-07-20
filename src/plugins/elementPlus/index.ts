/*
 * @Description: elementplus entry
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 14:11:59
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 16:03:15
 * @FilePath: \vite-admin-vue\src\plugins\elementPlus\index.ts
 */

import './source'
import * as components from './components'
import { defineAppPlugin } from '@/utils'

export default defineAppPlugin(app => {
  Object.entries(components).forEach(([key, value]) => {
    app.component(key, value)
  })
})
