/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-23 09:38:59
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-23 10:34:23
 * @FilePath: \vite-admin-vue\src\layouts\components\RouterBar\routerBar.ts
 */

import { RouteRecordNormalized, RouteLocationNormalizedLoaded } from 'vue-router'

export interface RouterType {
  fullPath: string
  path: string
  name: string
  meta: VRouter.RouteMeta
  params: Record<string | number, any>
  query: Record<string | number, any>
}

/**
 * 转换数据格式
 * @param item
 * @returns
 */
export const tranformRouterInfo = (
  item: RouteRecordNormalized | RouteLocationNormalizedLoaded
): RouterType => {
  return {
    fullPath: item.path,
    path: item?.path,
    name: item.name as string,
    meta: item.meta,
    params: {},
    query: {}
  }
}
