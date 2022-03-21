/*
 * @Description: plugins entry
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 14:11:35
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 16:27:11
 * @FilePath: \vite-admin-vue\src\plugins\index.ts
 */
import type { App } from 'vue'
import setupElementPlus from './elementPlus'
import setupElIcon from './elementPlusIcon'
import { registerGlobalComponent } from '@/components/register'
import setUpDayJs from './dayJs'

export default (app: App) => {
  setUpDayJs()
  setupElIcon(app)
  setupElementPlus(app)

  registerGlobalComponent(app)
}
