import { cloneDeep } from 'lodash-es'
import { RouteRecordRaw } from 'vue-router'
import { EXCEPTION_COMPONENT, Layout } from '../constant'

const layoutMap = new Map<string, () => Promise<typeof import('*.vue')>>()

layoutMap.set('LAYOUT', Layout)

let dynamicViewsModules: Record<string, () => Promise<Recordable>>

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
  if (!routes) return
  routes.forEach(item => {
    const { component, name } = item
    const { children } = item

    if (component) {
      const layoutFound = layoutMap.get((component as any).toUpperCase())
      if (layoutFound) {
        item.component = layoutFound
      } else {
        item.component = dynamicImport(dynamicViewsModules, component as unknown as string)
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
  const keys = Object.keys(dynamicViewsModules)
  const matchKeys = keys.filter(key => {
    const k = key.replace('../../views', '')
    const startFlag = component.startsWith('/')
    const endFlag = component.endsWith('.vue') || component.endsWith('.tsx')
    const startIndex = startFlag ? 0 : 1
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.')
    return k.substring(startIndex, lastIndex) === component
  })
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0]
    return dynamicViewsModules[matchKey]
  } else if (matchKeys?.length > 1) {
    console.warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure'
    )
    return
  } else {
    console.warn(
      '在src/views/下找不到`' + component + '.vue` 或 `' + component + '.tsx`, 请自行创建!'
    )
    return EXCEPTION_COMPONENT
  }
}
