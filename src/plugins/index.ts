/*
 * @Description: plugins entry
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 14:11:35
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-21 09:50:29
 * @FilePath: \vite-admin-vue\src\plugins\index.ts
 */

import setupElementPlus from './elementPlus'
import setupElIcon from './elementPlusIcon'
import setUpDayJs from './dayJs'
import setupPinia from './pinia'
import setupProgress from './nprogress'

import registerGlobalComponents from '@/components/register'
import { defineAppPlugin } from '@/utils'

export default defineAppPlugin(app => {
  // 进度条
  setupProgress(app)
  // pinia
  setupPinia(app)
  // dayjs
  setUpDayJs(app)
  // elementPlus
  setupElementPlus(app)
  // el-icon
  setupElIcon(app)
  // custom global components
  registerGlobalComponents(app)
})
