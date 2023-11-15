import { defineStore } from 'pinia'
import { ref } from 'vue'
import { setPermissionsCache, getPermissionsCache } from '../local'
import { filter } from '@/utils'
import router from '@/router'
import { pageError } from '@/router/routes'
import { asyncRoutes } from '@/router/routes/async'
import { flatRoutesLevel, routeMenusSort, transformRouteToMenu } from '@/router/helper'
import { cloneDeep } from 'lodash-es'
import projectSetting from '@/config/project-setting'

import type { RouteRecordRaw } from 'vue-router'
import type { Menu } from '@/router/types'
import { PermissionModeEnum } from '@/enum'
import useUserStore from './user'

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
    return routeMenusSort(menuFilter(cloneDeep(frontedMenuList.value)))
  }

  async function loadDynamicRoutes() {
    const dynamicRoutes = await buildPermissionRoutes()
    addRouteBatch(dynamicRoutes)
    router.addRoute(pageError)
  }

  function resetPermissionRoutes() {
    // TODO: 重置权限
  }

  function buildPermissionRoutes() {
    let routes: RouteRecordRaw[] = []

    if (projectSetting.permissionMode === PermissionModeEnum.ROUTE_MAPPING) {
      function routesFilter(route: RouteRecordRaw) {
        const name = route.name

        if (!name) return true

        if (route.meta?.ignoreAuth) return true

        return hasPermission(name as string)
      }
      routes = filter(asyncRoutes, routesFilter, { id: 'name' })
    } else if (projectSetting.permissionMode === PermissionModeEnum.ROLE) {
      const userStore = useUserStore()

      function roleFilter(route: RouteRecordRaw) {
        const roles = route.meta?.roles?.map(String)
        if (route.meta?.ignoreAuth) return true
        if (!userStore.roles) return false
        if (!roles || roles.length === 0) return true

        return userStore.hasRole(roles)
      }

      routes = filter(asyncRoutes, roleFilter, { id: 'name' })
    }

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
