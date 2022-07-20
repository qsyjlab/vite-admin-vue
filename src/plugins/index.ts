/*
 * @Description: plugins entry
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 14:11:35
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 16:03:40
 * @FilePath: \vite-admin-vue\src\plugins\index.ts
 */

import setupElementPlus from './elementPlus'
import setupElIcon from './elementPlusIcon'
import { registerGlobalComponent } from '@/components/register'
import setUpDayJs from './dayJs'
import setupPinia from './pinia'
import setupProgress from './nprogress'
import { defineAppPlugin } from '@/utils'

export default defineAppPlugin(app => {
  setupProgress(app)
  setupPinia(app)
  setUpDayJs(app)
  setupElIcon(app)
  setupElementPlus(app)
  registerGlobalComponent(app)
})
