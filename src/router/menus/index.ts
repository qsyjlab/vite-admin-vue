import type { RouteRecordRaw } from 'vue-router'

export type RouteModules = Record<
  string,
  {
    default: RouteRecordRaw | RouteRecordRaw[]
  }
>

const modules: RouteModules = import.meta.glob('../routes/modules/**/*.ts', { eager: true })
export const asyncRoutes = loadRouterModules()

// 加载路由模块
export function loadRouterModules() {
  const routeModuleList: RouteRecordRaw[] = []

  Object.keys(modules).forEach(key => {
    const m = modules[key].default

    const ml = Array.isArray(m) ? [...m] : [m]

    routeModuleList.push(...ml)
  })

  return routeModuleList
}

//递归过滤所有隐藏的菜单
function menuFilter(items: RouteRecordRaw[]) {
  return items.filter(item => {
    const show = !item.meta?.hideInMenu
    if (show && item.children) {
      item.children = menuFilter(item.children)
    }
    return show
  })
}

export function getAsyncMenus() {
  return menuFilter(asyncRoutes)
}

export function getMenus() {
  return getAsyncMenus()
}
