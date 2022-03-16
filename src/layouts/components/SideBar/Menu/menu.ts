/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 21:48:13
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 10:50:15
 * @FilePath: \vite-admin-vue\src\layouts\components\Menu\menu.ts
 */

import { RouteMeta } from 'vue-router'

export interface MenuItem {
  name: string
  meta: RouteMeta
  children?: MenuItem[]
}
