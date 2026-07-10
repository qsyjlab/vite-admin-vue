import { interceptors, requestCatch, transformResponse } from './axios-request-impl'
import { RequestResultAdapter } from './request-adapter'
import config from '@/config'

export const basicApiService = new RequestResultAdapter({
  interceptors,
  baseURL: import.meta.env.VITE_APP_MOCK_API_BASE_URL,
  transform: {
    transformResponse,
    requestCatch
  }
})

export const service = new RequestResultAdapter({
  interceptors,
  baseURL: config.baseApiUrl,
  transform: {
    transformResponse,
    requestCatch
  }
})

export const fileService = new RequestResultAdapter({
  interceptors,
  baseURL: 'http://localhost:9002/',
  transform: {
    transformResponse,
    requestCatch
  }
})

// 暴露出所有类型
export * from './axios-request/interface'
