import { defineStore } from 'pinia'
import { ref } from 'vue'
import projectSetting from '@/config/project-setting'
import { PermissionModeEnum } from '@/enum'
import useUserStore from './user'
import {
  setPermissionsCache,
  getPermissionsCache,
  setPermissionModeCache,
  getPermissionModeCache
} from '../local'
import { systemRouteEngine } from '@/router/engine'
import { getMenuList } from '@/api/permission'

import type { Menu } from '@/router/types'
import type { RouteRecordRaw } from 'vue-router'

export const usePermissionStore = defineStore('permissionStoreKey', () => {
  const permissions = ref<string[]>([])

  const frontedMenuList = ref<Menu[]>([])
  const dynamicRoutesSignature = ref('')

  // 运行时权限模式 —— 优先使用 localStorage 中缓存的值，回退到 projectSetting
  const permissionMode = ref<keyof typeof PermissionModeEnum>(
    (getPermissionModeCache() as keyof typeof PermissionModeEnum) || projectSetting.permissionMode
  )

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

  /** 设置权限模式（运行时切换，持久化到 localStorage） */
  function setPermissionMode(mode: keyof typeof PermissionModeEnum) {
    permissionMode.value = mode
    setPermissionModeCache(mode)
    // 模式切换后需要重新生成签名，强制下次 loadDynamicRoutes 重新加载
    dynamicRoutesSignature.value = ''
  }

  function getPermissionMode() {
    return permissionMode.value
  }

  async function loadDynamicRoutes() {
    const signature = getDynamicRoutesSignature()
    if (signature === dynamicRoutesSignature.value) {
      return
    }

    const userStore = useUserStore()

    // BACKED 模式需要从后端获取菜单路由数据
    let backendRoutes: RouteRecordRaw[] = []
    if (permissionMode.value === PermissionModeEnum.BACKED) {
      try {
        const res = await getMenuList()
        backendRoutes = (res.data || []) as unknown as RouteRecordRaw[]
      } catch {
        backendRoutes = []
      }
    }

    const { menus } = await systemRouteEngine.bootstrap({
      permissionMode: permissionMode.value,
      permissions: permissions.value,
      roles: userStore.roles,
      backendRoutes
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
    const mode = permissionMode.value

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
    permissionMode,
    getMenus,
    setPermissions,
    getPermissions,
    setFrontedMenuList,
    setPermissionMode,
    getPermissionMode,
    hasPermission,
    loadDynamicRoutes,
    resetPermissionRoutes
  }
})
