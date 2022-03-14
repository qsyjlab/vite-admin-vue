/*
 * @Description: plugins entry
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 14:11:35
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-14 14:43:44
 * @FilePath: \vite-admin-vue\src\plugins\index.ts
 */
import type { App } from 'vue'
import setupElementPlus from './elementPlus'

export default (app: App) => {
    setupElementPlus(app)
}
