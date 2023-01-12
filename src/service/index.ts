import BaseAxios from './axios-request/axios-request'

import { interceptorsHooks, transformResponse } from './axios-request-impl'

export const mockService = new BaseAxios({
  interceptorsHooks,
  baseURL: '/basic-api',
  transform: {
    transformResponse
  }
})

// 暴露出所有类型
export * from './axios-request/interface'

export * from './types'
