import { defineStore } from 'pinia'
import { ref } from 'vue'
import { filter } from '@/utils'
import router, { resetRouter } from '@/router'
import { pageError } from '@/router/routes'
import { asyncRoutes } from '@/router/routes/async'
import { generateRoutesToMenusHandler, routeConversionHandler } from '@/router/helper'
import projectSetting from '@/config/project-setting'
import { PermissionModeEnum } from '@/enum'
import useUserStore from './user'
import { setPermissionsCache, getPermissionsCache } from '../local'

import type { RouteRecordRaw } from 'vue-router'
import type { Menu } from '@/router/types'
import { transformObjToRoute } from '@/router/helper/dynamic'
import { createMatcher } from '@/router/helper/matched'

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
    return frontedMenuList.value
  }

  async function loadDynamicRoutes() {
    resetRouter()
    const dynamicRoutes = await buildPermissionRoutes()
    addRouteBatch(dynamicRoutes)
    router.addRoute(pageError)
  }

  function resetPermissionRoutes() {
    setPermissions([])
    resetRouter()
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
    } else {
      const backAsyncRoutes: RouteRecordRaw[] = []

      routes = transformObjToRoute(backAsyncRoutes)
    }

    createMatcher(routes)

    setFrontedMenuList(generateRoutesToMenusHandler(routes))

    const transformedRoutes = routeConversionHandler(routes)

    return transformedRoutes
  }

  function hasPermission(auth?: string | string[]) {
    if (!auth) return false

    if (Array.isArray(auth)) return auth.every(p => permissions.value.includes(p))
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
