import { interceptorHooks, requestCatch, transformResponse } from './axios-request-impl'
import { RequestResultAdapter } from './request-adapter'
import config from '@/config'

export const mockService = new RequestResultAdapter({
  interceptorHooks,
  baseURL: '/basic-api',
  transform: {
    transformResponse,
    requestCatch
  }
})

export const service = new RequestResultAdapter({
  interceptorHooks,
  baseURL: config.baseApiUrl,
  transform: {
    transformResponse,
    requestCatch
  }
})
// 暴露出所有类型
export * from './axios-request/interface'

export * from './types'
