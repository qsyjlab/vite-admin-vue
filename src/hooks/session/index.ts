/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-17 11:30:34
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-17 11:30:40
 * @FilePath: \vite-admin-vue\src\hooks\session\index.ts
 */
import BaseStorage from './BaseStorage'
import BaseCookie from './BaseCookie'

export { BaseStorage, BaseCookie }

/**
 * localstorage
 *@var {BaseStorage}
 * @desc 本地缓存
 */
export const $storage = new BaseStorage(window.localStorage, config.storage.prefix)

/**
 * session
 * @var {BaseStorage}
 * @description session会话
 */
export const $session = new BaseStorage(window.sessionStorage, config.storage.prefix)

/**
 * cookie
 * @var {BaseCookie}
 * @description cookie会话
 */
export const $cookie = new BaseCookie()
