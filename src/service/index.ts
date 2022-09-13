import BaseAxios from './baseAxiosRequest/baseAxiosRequest'

import { interceptorsHooks } from './interceptors'

import config from '@/config'

export const baseService = new BaseAxios({
  baseURL: config?.url.baseUrl.system,
  interceptorsHooks
})

export const localhostService = new BaseAxios({
  baseURL: '/basic-api',
  interceptorsHooks
})

// 暴露出所有类型
export * from './baseAxiosRequest/baseAxios'
