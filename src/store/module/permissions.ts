import { defineStore } from 'pinia'
import { ref } from 'vue'
import { setPermissionsCache, getPermissionsCache } from '../local'
import { filter } from '@/utils'
import { asyncRoutes } from '@/router/routes/async'
import { flatRoutesLevel, transformRouteToMenu } from '@/router/helper'
import router from '@/router'
import { pageError } from '@/router/routes'
import { cloneDeep } from 'lodash-es'
import type { RouteRecordRaw } from 'vue-router'
import type { Menu } from '@/router/types'

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

  /**
   * 这里权限可传入字符串或者数组 数组 权限满足一个 则 为 true
   */
  function hasPermission(auth?: string | string[]) {
    if (!auth) return false

    if (Array.isArray(auth)) return !!auth.map(p => permissions.value.includes(p)).find(i => i)
    return permissions.value.includes(auth)
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
