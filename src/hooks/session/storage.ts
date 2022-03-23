/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-18 14:23:57
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-23 14:29:01
 * @FilePath: \vite-admin-vue\src\hooks\session\storage.ts
 */

import BaseStorage from './BaseStorage'

import config from '@/config'
import { StorageKeys } from '@/enum'
import type { LayoutType } from '@/types/store/moudles/app'

export default () => {
  const $storage = new BaseStorage(window.localStorage, config.storage)
  /**
   * 设置用户信息
   * @param {Auth.UserInfo} data 用户信息
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
