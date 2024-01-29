import { createStorage } from '@/utils'
import { StorageKeys } from '@/enum'
import config from '@/config'

import type { ProjectLayoutConfig } from '@/layouts'

const prefix = config.storage.prefix

interface UserInfo {
  userId: string | number
  userName: string
}

const $storage = createStorage({
  prefixKey: prefix
})
/**
 * 设置用户信息
 * @param {UserInfo} data 用户信息
 */
export function setUserInfoCache(data: UserInfo) {
  $storage.set(StorageKeys.USER_INFO, data)
}

/**
 * 获取用户信息
 * @returns {UserInfo}
 */
export function getUserInfoCache() {
  return $storage.get<UserInfo>(StorageKeys.USER_INFO)
}

/**
 * 设置token
 * @param {String} token
 */
export function setTokenCahce(token: string) {
  $storage.set(StorageKeys.TOKEN, token)
}

/**
 *
 * @returns {String}
 */
export function getTokenCahce() {
  return $storage.get<string>(StorageKeys.TOKEN)
}

export function setPermissionsCache(permissions: string[]) {
  $storage.set(StorageKeys.PERMISSIONS, permissions)
}

export function getPermissionsCache() {
  return $storage.get<string[]>(StorageKeys.PERMISSIONS)
}
/**
 * 获取配置
 * @param {ProjectLayoutConfig} layout
 * @returns
 */
export function setLayoutCache(layout: ProjectLayoutConfig | undefined) {
  return $storage.set(StorageKeys.LAYOUT, layout)
}

/**
 * @returns {ProjectLayoutConfig}
 */
export function getLayoutCache() {
  return $storage.get<ProjectLayoutConfig>(StorageKeys.LAYOUT)
}

/**
 * 清除全部token
 */
export const clearCache = () => {
  $storage.clearAll()
}
