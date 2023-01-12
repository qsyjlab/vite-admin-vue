import type {
  RequestInterceptorsType,
  RequestInterceptorsCatchType,
  ResponseInterceptorsType,
  ResponseInterceptorsCatchType,
  InterceptorsType,
  AxiosTransform
} from '@/service/base-axios-request/interface'
import { logRequestError } from '@/utils'

const requestInterceptorsImpl: RequestInterceptorsType = config => {
  return config
}

const requestInterceptorsCatchImpl: RequestInterceptorsCatchType = error => {
  return Promise.reject(error)
}

const responseInterceptorsImpl: ResponseInterceptorsType = response => {
  return response
}

const responseInterceptorsCatchImpl: ResponseInterceptorsCatchType = error => {
  return Promise.reject(error)
}

export const transformResponse: AxiosTransform['transformResponse'] = response => {
  const { data: _data } = response
  const { code, message = '' } = _data || {}

  // 这里逻辑可以根据项目进行修改
  const hasSuccess = _data && Reflect.has(_data, 'code') && code !== 0

  if (hasSuccess) {
    return _data
  }

  // 自定义 code 信息
  logRequestError({
    message,
    code,
    method: response?.config?.method,
    fullpath: response?.request?.responseURL
  })

  const errorJson = {
    message,
    code
  }
  throw new Error(`${JSON.stringify(errorJson) || 'apiRequestFailed'}`)
}

export const interceptorsHooks: InterceptorsType = {
  requestInterceptors: requestInterceptorsImpl,
  requestInterceptorsCatch: requestInterceptorsCatchImpl,
  responseInterceptors: responseInterceptorsImpl,
  responseInterceptorsCatch: responseInterceptorsCatchImpl
}

export const transformImpl: AxiosTransform = {
  transformResponse
}
