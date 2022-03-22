/*
 * @Description: route root types
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 22:46:48
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-22 17:32:14
 * @FilePath: \vite-admin-vue\src\types\store\moudles\route.ts
 */

import { RouteMeta } from 'vue-router'

export interface MenuItem {
  name: string
  meta: RouteMeta
  children?: MenuItem[]
}

export interface RouteRootStateType {
  menuList: MenuItem[]
  isFristEntry: boolean
  keepAliveList: any
}
