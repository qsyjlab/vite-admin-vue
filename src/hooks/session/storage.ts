import BaseStorage from './BaseStorage'

import config from '@/config'
import { StorageKeys } from '@/enum'
import { LayoutType } from '@/store'

/**
 * TODO: 站定在目前位置
 */
interface UserInfo {
  userId: string | number
  userName: string
  userRole: string
}

export default () => {
  const $storage = new BaseStorage(window.localStorage, config.storage)
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
   * @param {LayoutType} layout
   * @returns
   */
  const setLayoutCache = (layout: LayoutType | undefined) => {
    return $storage.set(StorageKeys.Layout, layout, { isForever: true })
  }

  /**
   * @returns {LayoutType}
   */
  const getLayoutCache = () => {
    return $storage.get<LayoutType>(StorageKeys.Layout)
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
