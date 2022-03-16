/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-16 13:49:03
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 13:49:04
 * @FilePath: \vite-admin-vue\src\utils\component\install.ts
 */

import type { App } from 'vue'

/**
 * 挂载全局组件
 * @param {*} value 组件数组
 * @param {*} app app 根实例
 */
export const installComponents = (Modules: any[], app: App): void => {
  Object.entries(Modules).forEach(([key, value]) => {
    app.component('Icon' + key, value)
  })
}
