import BaseStorage from './BaseStorage'
import { StorageKeys } from '@/enum'

import type { ProjectLayoutConfig } from '@/layouts'

const expires: number = StorageKeys.Expire
const prefix: string = StorageKeys.Prefix

const $storage = new BaseStorage(window.localStorage, {
  expires,
  prefix
})
interface UserInfo {
  userId: string | number
  userName: string
  userRole: string
}

export const useStorageHelper = () => {
  /**
   * 设置用户信息
   * @param {UserInfo} data 用户信息
   */
  const setUserInfoCache = (data: UserInfo) => {
    $storage.set(StorageKeys.UserInfo, data)
  }

  /**
   * 获取用户信息
   * @returns {UserInfo}
   */
  const getUserInfoCache = () => {
    return $storage.get<UserInfo>(StorageKeys.UserInfo)
  }

  /**
   * 设置token
   * @param {String} token
   */
  const setTokenCahce = (token: string) => {
    $storage.set(StorageKeys.Token, token)
  }

  /**
   *
   * @returns {String}
   */
  const getTokenCahce = () => {
    return $storage.get<string>(StorageKeys.Token)
  }

  /**
   * 获取配置
   * @param {ProjectLayoutConfig} layout
   * @returns
   */
  const setLayoutCache = (layout: ProjectLayoutConfig | undefined) => {
    return $storage.set(StorageKeys.Layout, layout, { isForever: true })
  }

  /**
   * @returns {ProjectLayoutConfig}
   */
  const getLayoutCache = () => {
    return $storage.get<ProjectLayoutConfig>(StorageKeys.Layout)
  }

  /**
   * 清除全部token
   */
  const clearCache = () => {
    $storage.clearAll()
  }

  return {
    $storage,
    setUserInfoCache,
    getUserInfoCache,
    setTokenCahce,
    getTokenCahce,
    setLayoutCache,
    getLayoutCache,
    clearCache
  }
}

export default useStorageHelper
