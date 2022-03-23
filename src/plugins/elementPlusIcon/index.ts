/*
 * @Description: 注册全局 icon 组件
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-16 11:33:39
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-23 11:14:29
 * @FilePath: \vite-admin-vue\src\plugins\elementPlusIcon\index.ts
 */
import type { App } from 'vue'

import * as icons from './icon'

export default (app: App): void => {
  Object.entries(icons).forEach(([key, value]) => {
    app.component('Icon' + key, value)
  })
}
