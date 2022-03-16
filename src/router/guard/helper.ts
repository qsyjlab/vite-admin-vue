/*
 * @Description: 助手函数
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-16 10:14:20
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 10:39:21
 * @FilePath: \vite-admin-vue\src\router\guard\helper.ts
 */

import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

export function handlePermissionRouter(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  return next()
}
