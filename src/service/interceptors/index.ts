import type {
  RequestInterceptorsType,
  RequestInterceptorsCatchType,
  ResponseInterceptorsType,
  ResponseInterceptorsCatchType,
  InterceptorsType,
  AxiosTransform
} from '@/service/base-axios-request/base-axios'
import { customStatusCodeError } from './log'

const requestInterceptorsImpl: RequestInterceptorsType = config => {
  return config
}

const requestInterceptorsCatchImpl: RequestInterceptorsCatchType = error => {
  return error
}

const responseInterceptorsImpl: ResponseInterceptorsType = response => {
  return response
}

const responseInterceptorsCatchImpl: ResponseInterceptorsCatchType = error => {
  return error
}

/**
 * 对最终结果进行处理,在拦截器之后执行，可以被 内置transformRespons属性覆盖
 * 在这里处理自定义的错误，和自定义结果返回
 *
 */
export const transformResponse: AxiosTransform['transformResponse'] = response => {
  const { data: _data } = response
  const { code, message = '' } = _data || {}

  // 这里逻辑可以根据项目进行修改
  const hasSuccess = _data && Reflect.has(_data, 'code') && code !== 0

  if (hasSuccess) {
    return _data
  }

  // 自定义 code 信息
  customStatusCodeError({
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
