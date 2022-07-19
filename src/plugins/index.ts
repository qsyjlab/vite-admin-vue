/*
 * @Description: plugins entry
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 14:11:35
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-19 16:15:47
 * @FilePath: \vite-admin-vue\src\plugins\index.ts
 */
import type { App } from 'vue'
import setupElementPlus from './elementPlus'
import setupElIcon from './elementPlusIcon'
import { registerGlobalComponent } from '@/components/register'
import setUpDayJs from './dayJs'
// import setupPinia from './pinia'

import 'nprogress/nprogress.css'

export default (app: App) => {
  // setupPinia(app)
  setUpDayJs()
  setupElIcon(app)
  setupElementPlus(app)

  registerGlobalComponent(app)
}
