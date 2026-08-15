import { isFunction, isObject } from '@/utils'
import type { RouteRecordRaw } from 'vue-router'

const ROUTE_COMPONENT_NAMED = Symbol('ROUTE_COMPONENT_NAMED')

function normalizeComponentName(name: string) {
  const normalizedName = name.replace(/[^A-Za-z0-9_]/g, '_')
  return normalizedName || 'RoutePage'
}

function getRouteComponentName(route: RouteRecordRaw) {
  if (typeof route.name === 'string' && route.name.trim()) {
    return normalizeComponentName(route.name)
  }

  if (typeof route.path === 'string' && route.path.trim()) {
    return normalizeComponentName(route.path)
  }

  return ''
}

export const createHasNameComponent = (
  component: RouteRecordRaw['component'],
  name: string
): RouteRecordRaw['component'] => {
  if (!component || !name) return component

  if (isFunction(component)) {
    if ((component as any)[ROUTE_COMPONENT_NAMED]) return component

    const wrappedComponent = async () => {
      const loaded = await Promise.resolve((component as any)())

      if (isObject(loaded) && isObject((loaded as any).default)) {
        const defaultComponent = (loaded as any).default as Record<string, any>
        if (defaultComponent.name) return loaded

        return {
          ...(loaded as Record<string, any>),
          default: {
            ...defaultComponent,
            name
          }
        }
      }

      if (isObject(loaded)) {
        const loadedComponent = loaded as Record<string, any>
        if (loadedComponent.name) return loaded

        return {
          ...loadedComponent,
          name
        }
      }

      return loaded
    }

    ;(wrappedComponent as any)[ROUTE_COMPONENT_NAMED] = true
    return wrappedComponent as unknown as RouteRecordRaw['component']
  }

  if (isObject(component)) {
    const componentObject = component as Record<string, any>
    if (componentObject.name) return component

    return {
      ...componentObject,
      name
    } as RouteRecordRaw['component']
  }

  return component
}

export function setComponentName(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.map(route => {
    const nextRoute: RouteRecordRaw = { ...route }

    if (!nextRoute.meta?.ignoreKeepAlive && nextRoute.component) {
      const componentName = getRouteComponentName(nextRoute)
      nextRoute.component = createHasNameComponent(nextRoute.component, componentName)
    }

    if (nextRoute.children?.length) {
      nextRoute.children = setComponentName(nextRoute.children)
    }

    return nextRoute
  })
}
