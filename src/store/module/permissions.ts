import { defineStore } from 'pinia'
import { ref } from 'vue'
import projectSetting from '@/config/project-setting'
import { PermissionModeEnum } from '@/enum'
import useUserStore from './user'
import { setPermissionsCache, getPermissionsCache } from '../local'
import { systemRouteEngine } from '@/router/engine'

import type { Menu } from '@/router/types'

export const usePermissionStore = defineStore('permissionStoreKey', () => {
  const permissions = ref<string[]>([])

  const frontedMenuList = ref<Menu[]>([])
  const dynamicRoutesSignature = ref('')

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
    const signature = getDynamicRoutesSignature()
    if (signature === dynamicRoutesSignature.value) {
      return
    }

    const userStore = useUserStore()
    const { menus } = await systemRouteEngine.bootstrap({
      permissionMode: projectSetting.permissionMode,
      permissions: permissions.value,
      roles: userStore.roles
    })
    setFrontedMenuList(menus)
    dynamicRoutesSignature.value = signature
  }

  function resetPermissionRoutes() {
    setPermissions([])
    dynamicRoutesSignature.value = ''
    setFrontedMenuList([])
    systemRouteEngine.reset()
  }

  function getDynamicRoutesSignature() {
    const userStore = useUserStore()
    const mode = projectSetting.permissionMode

    if (mode === PermissionModeEnum.ROUTE_MAPPING) {
      return JSON.stringify([mode, [...permissions.value].map(String).sort()])
    }

    if (mode === PermissionModeEnum.ROLE) {
      return JSON.stringify([mode, [...(userStore.roles || [])].map(String).sort()])
    }

    return mode
  }

  function hasPermission(auth?: string | string[]) {
    if (!auth) return false

    if (Array.isArray(auth)) return auth.every(p => permissions.value.includes(p))
    return permissions.value.includes(auth)
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
