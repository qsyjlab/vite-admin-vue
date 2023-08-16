import { createStorage } from '@/utils'
import { StorageKeys } from '@/enum'

import type { ProjectLayoutConfig } from '@/layouts'

const expire: number = StorageKeys.Expire
const prefix: string = StorageKeys.Prefix

interface UserInfo {
  userId: string | number
  userName: string
  // userRole: string
}

const $storage = createStorage()
/**
 * 设置用户信息
 * @param {UserInfo} data 用户信息
 */
export function setUserInfoCache(data: UserInfo) {
  $storage.set(StorageKeys.UserInfo, data)
}

/**
 * 获取用户信息
 * @returns {UserInfo}
 */
export function getUserInfoCache() {
  return $storage.get<UserInfo>(StorageKeys.UserInfo)
}

/**
 * 设置token
 * @param {String} token
 */
export function setTokenCahce(token: string) {
  $storage.set(StorageKeys.Token, token)
}

/**
 *
 * @returns {String}
 */
export function getTokenCahce() {
  return $storage.get<string>(StorageKeys.Token)
}

export function setPermissionsCache(permissions: string[]) {
  $storage.set('_PERMISSIONS_', permissions)
}

export function getPermissionsCache() {
  return $storage.get<string[]>('_PERMISSIONS_')
}
/**
 * 获取配置
 * @param {ProjectLayoutConfig} layout
 * @returns
 */
export function setLayoutCache(layout: ProjectLayoutConfig | undefined) {
  return $storage.set(StorageKeys.Layout, layout, { isForever: true })
}

/**
 * @returns {ProjectLayoutConfig}
 */
export function getLayoutCache() {
  return $storage.get<ProjectLayoutConfig>(StorageKeys.Layout)
}

/**
 * 清除全部token
 */
export const clearCache = () => {
  $storage.clearAll()
}
