import type { RouteRecordNormalized, RouteLocationNormalizedLoaded, RouteMeta } from 'vue-router'

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
export function tranformRouterInfo(
  item: RouteRecordNormalized | RouteLocationNormalizedLoaded
): RouterType {
  return {
    fullPath: item.path,
    path: item?.path,
    name: item.name as string,
    meta: item.meta,
    params: {},
    query: {}
  }
}
