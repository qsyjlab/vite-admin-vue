import { cloneDeep } from 'lodash-es'
import type { RouteRecordRaw, Router } from 'vue-router'

type MaybePromise<T> = T | Promise<T>

type RouteTransformHandler<TContext> = (
  routes: RouteRecordRaw[],
  context: TContext
) => MaybePromise<RouteRecordRaw[]>

type MenuProjectHandler<TContext, TMenu> = (
  routes: RouteRecordRaw[],
  context: TContext
) => MaybePromise<TMenu[]>

interface CreateRouteEngineOptions<TContext, TMenu> {
  router: Router
  staticRouteNames: string[]
  loadRoutes: () => MaybePromise<RouteRecordRaw[]>
  normalizeRoutes?: RouteTransformHandler<TContext>
  validateRoutes?: RouteTransformHandler<TContext>
  authorizeRoutes: RouteTransformHandler<TContext>
  transformRoutes: RouteTransformHandler<TContext>
  projectMenus: MenuProjectHandler<TContext, TMenu>
  fallbackRoute?: RouteRecordRaw
}

export interface RouteEngineBuildResult<TMenu = unknown> {
  routes: RouteRecordRaw[]
  menus: TMenu[]
  routeNames: string[]
}

function collectRouteNames(routes: RouteRecordRaw[], names: string[] = []) {
  routes.forEach(route => {
    if (route.name) {
      names.push(String(route.name))
    }
    if (route.children?.length) {
      collectRouteNames(route.children, names)
    }
  })

  return names
}

export function createRouteEngine<TContext = Record<string, never>, TMenu = unknown>(
  options: CreateRouteEngineOptions<TContext, TMenu>
) {
  const {
    router,
    staticRouteNames,
    loadRoutes,
    normalizeRoutes = routes => routes,
    validateRoutes = routes => routes,
    authorizeRoutes,
    transformRoutes,
    projectMenus,
    fallbackRoute
  } = options

  async function build(context: TContext): Promise<RouteEngineBuildResult<TMenu>> {
    // 入口统一深拷贝一次，隔离路由模块缓存等外部状态；
    // 各 handler 以「最后一个消费者可原地修改」为约定，不再逐级克隆
    const loadedRoutes = cloneDeep(await loadRoutes())
    const normalizedRoutes = await normalizeRoutes(loadedRoutes, context)
    const validatedRoutes = await validateRoutes(normalizedRoutes, context)
    const authorizedRoutes = await authorizeRoutes(validatedRoutes, context)
    // projectMenus 内部自带克隆，menus 节点与授权树完全分离
    const menus = await projectMenus(authorizedRoutes, context)
    // transformRoutes 是授权树的最后一个消费者，可原地修改
    const transformedRoutes = await transformRoutes(authorizedRoutes, context)

    return {
      routes: transformedRoutes,
      menus,
      routeNames: collectRouteNames(transformedRoutes)
    }
  }

  function reset() {
    router.getRoutes().forEach(route => {
      const { name } = route
      if (!name) return
      if (staticRouteNames.includes(String(name))) return
      if (!router.hasRoute(name)) return

      router.removeRoute(name)
    })
  }

  function register(routes: RouteRecordRaw[]) {
    routes.forEach(route => {
      router.addRoute(route)
    })

    if (fallbackRoute) {
      router.addRoute(fallbackRoute)
    }
  }

  async function bootstrap(context: TContext): Promise<RouteEngineBuildResult<TMenu>> {
    const result = await build(context)
    reset()
    register(result.routes)
    return result
  }

  return {
    build,
    reset,
    register,
    bootstrap
  }
}
