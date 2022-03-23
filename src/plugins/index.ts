/*
 * @Description: plugins entry
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 14:11:35
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-23 14:50:52
 * @FilePath: \vite-admin-vue\src\plugins\index.ts
 */
import type { App } from 'vue'
import setupElementPlus from './elementPlus'
import setupElIcon from './elementPlusIcon'
import { registerGlobalComponent } from '@/components/register'
import setUpDayJs from './dayJs'

import 'nprogress/nprogress.css'

export default (app: App) => {
  setUpDayJs()
  setupElIcon(app)
  setupElementPlus(app)

  registerGlobalComponent(app)
}
