import type { RouteRecordRaw } from 'vue-router'
import { BlankContainer, Layout } from '../constant'

interface RouteDraft extends Record<string, any> {
  name?: string | symbol
  path?: string
  meta?: Record<string, any>
  component?: RouteRecordRaw['component']
  redirect?: RouteRecordRaw['redirect']
  children?: RouteDraft[]
}

export interface DefineRoutesOptions {
  rootComponent?: RouteRecordRaw['component']
  nestedComponent?: RouteRecordRaw['component']
}

const defaultDefineRoutesOptions: DefineRoutesOptions = {
  rootComponent: Layout,
  nestedComponent: BlankContainer
}

function getDefaultRedirect(children: RouteDraft[]) {
  // 过滤掉带有动态参数的子路由，避免 redirect 到需要必填参数的路由
  // 例如 detail/:id 这类路由不能作为 redirect 目标
  const staticChildren = children.filter(item => !String(item.path || '').includes(':'))
  if (!staticChildren.length) return undefined

  const firstRoute = staticChildren.find(item => !item.meta?.hideInMenu) || staticChildren[0]
  if (!firstRoute) return undefined

  if (firstRoute.name) {
    return { name: String(firstRoute.name) }
  }

  if (firstRoute.path) {
    return { path: firstRoute.path }
  }

  return undefined
}

function normalizeRoute(
  route: RouteDraft,
  depth: number,
  options: DefineRoutesOptions
): RouteRecordRaw {
  const normalizedRoute: RouteDraft = { ...route }
  const hasChildren = Array.isArray(normalizedRoute.children) && normalizedRoute.children.length > 0

  if (hasChildren) {
    normalizedRoute.children = normalizedRoute.children?.map(child =>
      normalizeRoute(child, depth + 1, options)
    )
  } else if (Array.isArray(normalizedRoute.children) && normalizedRoute.children.length === 0) {
    delete normalizedRoute.children
  }

  if (!normalizedRoute.component) {
    if (hasChildren) {
      normalizedRoute.component = depth === 0 ? options.rootComponent : options.nestedComponent
    } else if (normalizedRoute.meta?.href) {
      normalizedRoute.component = options.nestedComponent
    }
  }

  if (hasChildren && !normalizedRoute.redirect) {
    const redirect = getDefaultRedirect(normalizedRoute.children || [])
    if (redirect) {
      normalizedRoute.redirect = redirect
    }
  }

  return normalizedRoute as RouteRecordRaw
}

export function defineRoutes(
  routes: RouteDraft[],
  options: DefineRoutesOptions = {}
): RouteRecordRaw[] {
  const finalOptions: DefineRoutesOptions = {
    ...defaultDefineRoutesOptions,
    ...options
  }

  return routes.map(route => normalizeRoute(route, 0, finalOptions))
}

export function defineRoute(route: RouteDraft, options: DefineRoutesOptions = {}): RouteRecordRaw {
  return defineRoutes([route], options)[0]
}

export function defineExposeRoutes(
  routes: RouteDraft[],
  options: DefineRoutesOptions = {}
): RouteRecordRaw[] {
  return defineRoutes(routes, options)
}

export function defineRouteModule(
  route: RouteDraft,
  options: DefineRoutesOptions = {}
): RouteRecordRaw {
  return defineRoute(route, options)
}
