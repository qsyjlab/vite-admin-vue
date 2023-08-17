import { defineStore } from 'pinia'
import { ref } from 'vue'
import { setPermissionsCache, getPermissionsCache } from '../local'
import type { RouteRecordRaw } from 'vue-router'
import { filter } from '@/utils'
import { asyncRoutes } from '@/router/routes/async'
import { flatRoutesLevel, transformRouteToMenu } from '@/router/helper'
import router from '@/router'
import { pageError } from '@/router/routes'
import { cloneDeep } from 'lodash-es'

type RouteMenu = Pick<RouteRecordRaw, 'meta' | 'name' | 'path' | 'redirect'>

interface Menu extends RouteMenu {
  children?: Menu[]
}

export const usePermissionStore = defineStore('permissionStoreKey', () => {
  const permissions = ref<string[]>([])

  const frontedMenuList = ref<Menu[]>([])

  const permission = getPermissionsCache()

  if (permission) {
    permissions.value = permission
  }

  function setPermissions(val: string[]) {
    permissions.value = val
    setPermissionsCache(permissions.value)
  }

  function getPermissions() {
    return permissions.value
  }

  function setFrontedMenuList(menus: Menu[]) {
    console.log('menus', menus)

    frontedMenuList.value = menus
  }

  function getMenus() {
    const menuFilter = (items: Menu[]) => {
      return items.filter(item => {
        const show = !item.meta?.hideInMenu
        if (show && item.children) {
          item.children = menuFilter(item.children)
        }
        return show
      })
    }

    return menuFilter(cloneDeep(frontedMenuList.value))
  }

  async function loadDynamicRoutes() {
    const dynamicRoutes = await buildPermissionRoutes()
    addRouteBatch(dynamicRoutes)
    router.addRoute(pageError)
  }

  function resetPermissionRoutes() {}

  function buildPermissionRoutes() {
    let routes = []

    function routerFilter(route: RouteRecordRaw) {
      const name = route.name

      if (!name) return true
      return hasPermission(name as string)
    }

    routes = filter(asyncRoutes, routerFilter, { id: 'name' })
    setFrontedMenuList(transformRouteToMenu(routes) as Menu[])
    return flatRoutesLevel(routes)
  }

  function hasPermission(permission?: string) {
    return true
    // if (!permission) return false
    // return permissions.value.includes(permission)
  }
  function addRouteBatch(routes: RouteRecordRaw[]) {
    routes.forEach(r => {
      router.addRoute(r)
    })
  }

  return {
    permissions,
    getMenus,
    setPermissions,
    getPermissions,
    setFrontedMenuList,
    hasPermission,
    loadDynamicRoutes,
    resetPermissionRoutes
  }
})
