/*
 * @Description: vue-router.d.ts entry
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 15:21:37
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 22:30:57
 * @FilePath: \vite-admin-vue\src\types\router\index.d.ts
 */

import 'vue-router'

declare module 'vue-router' {
  export interface RouteMeta extends VRouter.RouteMeta {
    title: string
  }
}
