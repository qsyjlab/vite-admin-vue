/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-18 14:23:57
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 15:39:20
 * @FilePath: \vite-admin-vue\src\hooks\session\storage.ts
 */

import BaseStorage from './BaseStorage'

import config from '@/config'
import { StorageKeys } from '@/enum'

export default () => {
  const $storage = new BaseStorage(window.localStorage, config.storage.prefix)
  /**
   * 设置用户信息
   * @param data 用户信息
   */
  const setUserInfoCache = (data: Auth.UserInfo) => {
    $storage.set(StorageKeys.UserInfo, data)
  }

  /**
   * 获取用户信息
   * @returns {Auth.UserInfo}
   */
  const getUserInfoCache = () => {
    return $storage.get<Auth.UserInfo>(StorageKeys.UserInfo)
  }

  /**
   * 设置token
   * @param token
   */
  const setTokenCahce = (token: string) => {
    $storage.set(StorageKeys.Token, token)
  }

  /**
   * 获取token
   */
  const getTokenCahce = () => {
    return $storage.get<string>(StorageKeys.Token)
  }

  const clearCache = () => {
    $storage.clear()
  }

  return {
    $storage,
    setUserInfoCache,
    getUserInfoCache,
    setTokenCahce,
    getTokenCahce,
    clearCache
  }
}
