/*
 * @Description: service entry
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-13 00:48:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-08-26 17:50:21
 * @FilePath: \vite-admin-vue\src\service\index.ts
 */

import BaseAxios from './baseAxiosRequest/baseAxiosRequest'

import { interceptorsHooks } from './interceptors'

import config from '@/config'

// 暴露出所有类型
export * from './baseAxiosRequest/baseAxios'

export const baseService = new BaseAxios({
  baseURL: config.url.baseUrl.system,
  interceptorsHooks
})
