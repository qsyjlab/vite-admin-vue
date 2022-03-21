/*
 * @Description: 助手方法
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 16:01:22
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 22:11:22
 * @FilePath: \vite-admin-vue\src\utils\router\helpers.ts
 */

import { hasAuth } from './auth'

type RouteType = VRouter.DefineRoutes
type RFiles = Record<
  string,
  {
    [key: string]: any
    default: VRouter.DefineRoutes[]
  }
>

/**
 *
 * @param {String} files 文件夹路径
 * @returns { RouteType }
 */
export const loadRoutes = (files: RFiles): RouteType[] => {
  return Object.keys(files).reduce((arr: RouteType[], key: string): RouteType[] => {
    const routes: RouteType[] = files[key].default
    arr.push(...routes)
    return arr
  }, [])
}

/**
 *  默认暴露类型检测
 * @param { VRouter.DefineRoutes[]} routes
 * @returns { VRouter.DefineRoutes[] }
 */
export function defineExposeRoutes(routes: VRouter.DefineRoutes[]): VRouter.DefineRoutes[] {
  return routes
}

/**
 * 将路由转换成菜单列表 并验证权限
 * @param { VRouter.DefineRoutes[] } routes 路由
 * @param { VRouter.DefineRoutes[] } treeMap 默认值
 * @returns { VRouter.DefineRoutes[] }
 */
export function transformRouteToList<
  T extends {
    children?: T[]
    meta: { sort?: number | undefined; isNotAuth: boolean }
    name: string
  }
>(routes: T[], treeMap: T[] = []): T[] {
  if (routes && routes?.length === 0) return []

  return routes
    .reduce((acc, cur) => {
      if (cur.meta.isNotAuth || hasAuth(cur.name))
        acc.push({
          ...cur,
          children: transformRouteToList((cur?.children || []) as T[], [])
        })
      return acc
    }, treeMap)
    .reverse()
    .sort((last, next) => (last.meta?.sort || 0) - (next.meta?.sort || 0))
}
