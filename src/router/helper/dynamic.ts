import { cloneDeep } from 'lodash-es'
import type { RouteRecordRaw } from 'vue-router'
import { EXCEPTION_COMPONENT, Layout } from '../constant'

const layoutMap = new Map<string, () => Promise<typeof import('*.vue')>>()

layoutMap.set('LAYOUT', Layout)

let dynamicViewsModules: Record<string, () => Promise<Recordable>>
let dynamicViewModuleMap: Record<string, () => Promise<Recordable>> | null = null

function createViewModuleMap(modules: Record<string, () => Promise<Recordable>>) {
  const moduleMap: Record<string, () => Promise<Recordable>> = {}

  Object.keys(modules).forEach(key => {
    const loader = modules[key]
    const normalizedPath = key.replace('../../views/', '')
    const withoutExt = normalizedPath.replace(/\.(vue|tsx)$/, '')
    const candidates = [normalizedPath, `/${normalizedPath}`, withoutExt, `/${withoutExt}`]

    candidates.forEach(candidate => {
      const existed = moduleMap[candidate]
      if (existed && existed !== loader) {
        console.warn(
          `路由组件路径 "${candidate}" 匹配到多个视图文件，请避免在同目录使用同名 .vue/.tsx 文件。`
        )
        return
      }
      moduleMap[candidate] = loader
    })
  })

  return moduleMap
}

export function transformObjToRoute<T = RouteRecordRaw>(routeList: RouteRecordRaw[]): T[] {
  routeList.forEach(route => {
    const component = route.component as unknown as string
    if (component) {
      if (component.toUpperCase() === 'LAYOUT') {
        route.component = layoutMap.get(component.toUpperCase())
      } else {
        route.children = [cloneDeep(route)]
        route.component = Layout

        //某些情况下如果name如果没有值， 多个一级路由菜单会导致页面404
        if (!route.name) {
          console.warn('找不到菜单对应的name, 请检查数据!' + JSON.stringify(route))
        }
        route.name = `${route.name?.toString()}Parent`
        route.path = ''
        const meta = route.meta || {}
        meta.single = true
        meta.affix = false
        route.meta = meta
      }
    } else {
      console.warn('请正确配置路由：' + route?.name?.toString() + '的component属性')
    }

    if (route.children) {
      asyncImportRoute(route.children)
    }
  })
  return routeList as unknown as T[]
}

// Dynamic introduction
function asyncImportRoute(routes: RouteRecordRaw[] | undefined) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}')
  dynamicViewModuleMap = dynamicViewModuleMap || createViewModuleMap(dynamicViewsModules)
  if (!routes) return
  routes.forEach(item => {
    const { component } = item
    const { children } = item

    if (component) {
      const layoutFound = layoutMap.get((component as any).toUpperCase())
      if (layoutFound) {
        item.component = layoutFound
      } else {
        item.component = dynamicImport(dynamicViewModuleMap || {}, component as unknown as string)
      }
    }

    if (children) {
      asyncImportRoute(children)
    }
  })
}

function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<Recordable>>,
  component: string
) {
  const componentPath = component.trim()
  const matchedLoader = dynamicViewsModules[componentPath]

  if (matchedLoader) return matchedLoader

  console.warn(
    '在src/views/下找不到`' + component + '.vue` 或 `' + component + '.tsx`, 请自行创建!'
  )
  return EXCEPTION_COMPONENT
}
