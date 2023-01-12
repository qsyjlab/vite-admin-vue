import {
  RequestInterceptorsType,
  RequestInterceptorsCatchType,
  ResponseInterceptorsType,
  ResponseInterceptorsCatchType,
  InterceptorsType,
  RequestTransform,
  ResultEnum
} from '../axios-request'
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

export const transformResponse: RequestTransform['transformResponse'] = response => {
  const { data: _data } = response
  const { code, message = '' } = _data || {}

  switch (code) {
    case ResultEnum.SUCCESS:
      return _data

    default: {
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
  }
}

export const interceptorsHooks: InterceptorsType = {
  requestInterceptors: requestInterceptorsImpl,
  requestInterceptorsCatch: requestInterceptorsCatchImpl,
  responseInterceptors: responseInterceptorsImpl,
  responseInterceptorsCatch: responseInterceptorsCatchImpl
}

export const transformImpl: RequestTransform = {
  transformResponse
}
