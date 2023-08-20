import type { RouteLocationNormalized, RouteMeta } from 'vue-router'

export interface RouterType {
  fullPath: string
  path: string
  name: string
  meta: RouteMeta
  params: Record<string | number, any>
  query: Record<string | number, any>
}

/**
 * 转换数据格式
 * @param item
 * @returns
 */
export function tranformRouterInfo(item: RouteLocationNormalized): RouterType {
  return {
    fullPath: item.fullPath,
    path: item?.path,
    name: item.name as string,
    meta: item.meta,
    params: item.query,
    query: item.query
  }
}
