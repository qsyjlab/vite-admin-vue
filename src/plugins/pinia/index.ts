/*
 * @Description: pinia plugin
 * @Autor: qsyj
 * @Date: 2022-07-19 11:42:12
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-19 11:43:54
 */
import type { App } from 'vue'

import { createPinia } from 'pinia'

export default (app: App) => {
  const pinia = createPinia()
  app.use(pinia)
}
