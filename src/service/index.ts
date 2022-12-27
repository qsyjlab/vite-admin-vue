import BaseAxios from './base-axios-request/base-axios-request'

import { interceptorsHooks, transformResponse } from './interceptors'

export const mockService = new BaseAxios({
  interceptorsHooks,
  baseURL: '/basic-api',
  transform: {
    transformResponse
  }
})

// 暴露出所有类型
export * from './base-axios-request/base-axios'
