import { interceptorsHooks, requestCatch, transformResponse } from './axios-request-impl'
import { RequestResultAdapter } from './request-adapter'

export const mockService = new RequestResultAdapter({
  interceptorsHooks,
  baseURL: '/basic-api',
  transform: {
    transformResponse,
    requestCatch
  }
})

// 暴露出所有类型
export * from './axios-request/interface'

export * from './types'
