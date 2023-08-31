import type {
  RequestInterceptorsType,
  RequestInterceptorsCatchType,
  ResponseInterceptorsType,
  ResponseInterceptorsCatchType,
  InterceptorsType,
  RequestTransform
} from '../axios-request'

import { isAxiosError, isCancelError } from '../axios-request'
import { checkStatus } from './check-status'

import { ResultEnum, showErrorMessage } from './helper'
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

export const transformResponse: RequestTransform['transformResponse'] = (
  response,
  requestConfigEx
) => {
  const { ignoreResponseErrorMessage = false } = requestConfigEx

  const { data: _data } = response
  const { code, message = '' } = _data || {}

  switch (code) {
    case ResultEnum.SUCCESS:
      return _data

    default: {
      // 根据具体业务来确定默认值
      const errorJson = {
        message: message || '服务器错误',
        code: code || -1,
        data: null
      }

      !ignoreResponseErrorMessage && showErrorMessage(errorJson.message)

      console.error(
        '[AxiosRequest error]:',
        `${response?.config?.method?.toUpperCase()} ${response?.request?.responseURL} ${
          errorJson.code
        } (${errorJson.message})`
      )

      throw new Error(`${JSON.stringify(errorJson)}`)
    }
  }
}

export const requestCatch: RequestTransform['requestCatch'] = (error, requestOptionsEx) => {
  const { ignoreErrorMessage = false } = requestOptionsEx

  if (!isAxiosError(error)) {
    !ignoreErrorMessage && !isCancelError(error) && showErrorMessage(error.message)

    return error
  }

  checkStatus(Number(error.response?.status))

  return error
}

export const interceptorsHooks: InterceptorsType = {
  requestInterceptors: requestInterceptorsImpl,
  requestInterceptorsCatch: requestInterceptorsCatchImpl,
  responseInterceptors: responseInterceptorsImpl,
  responseInterceptorsCatch: responseInterceptorsCatchImpl
}
