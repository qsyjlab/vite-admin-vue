/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-18 14:23:57
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-18 14:40:10
 * @FilePath: \vite-admin-vue\src\hooks\session\storage.ts
 */

import BaseStorage from './BaseStorage'

import config from '@/config'
import { StorageKeys } from '@/enum'

const $storage = new BaseStorage(window.localStorage, config.storage.prefix)

export default () => {
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
    $storage.get<string>(StorageKeys.Token)
  }

  return {
    $storage,
    setUserInfoCache,
    getUserInfoCache,
    setTokenCahce,
    getTokenCahce
  }
}
