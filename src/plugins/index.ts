/*
 * @Description: plugins entry
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 14:11:35
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-17 14:51:00
 * @FilePath: \vite-admin-vue\src\plugins\index.ts
 */
import type { App } from 'vue'
import setupElementPlus from './elementPlus'
import setupElIcon from './elementPlusIcon'
import { registerGlobalComponent } from '@/components/register'

export default (app: App) => {
  setupElIcon(app)
  setupElementPlus()

  registerGlobalComponent(app)
}
