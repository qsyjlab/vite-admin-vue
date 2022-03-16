/*
 * @Description: declare router
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 22:39:55
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 10:52:02
 * @FilePath: \vite-admin-vue\src\types\router\router.d.ts
 */
/// <reference types="vue-router" />

declare namespace VRouter {
  // router meta
  export interface RouteMeta {
    // 路由标题
    title: string
    // 是否验证权限
    isAuth?: boolean
    // 是否缓存
    isKeepAlive?: boolean
    // 图标
    icon?: string
    // 菜单栏隐藏
    hideInMenu?: boolean
    // 面包屑 导航隐藏
    hideInBreadcrumb?: boolean
    // 排序
    sort?: number
  }

  // 路由成员类型
  export type DefineRoutes = import('vue-router').RouteRecordRaw & { redirect?: import('vue-router').RouteRecordRedirectOption | Record<string, any> } & {
    children: DefineRoutes[]
  }
}
