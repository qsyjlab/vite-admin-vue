import type {
  RequestInterceptorsType,
  RequestInterceptorsCatchType,
  ResponseInterceptorsType,
  ResponseInterceptorsCatchType,
  InterceptorsType,
  RequestTransform
  // RequestMethodConfig
} from '../axios-request'

import { isAxiosError, isCancelError } from '../axios-request'
import { checkStatus } from './check-status'

import { ResultEnum, showErrorMessage } from './helper'
// import { mockService } from '../index'
// import { refreshToken } from '@/api/user'

// interface PendingTaskQueue {
//   config: any
//   resolve: (...args: any[]) => any
// }

// const pendingTaskQueue: PendingTaskQueue[] = []
// const refreshing = false

const requestInterceptorsImpl: RequestInterceptorsType = config => {
  return config
}

const requestInterceptorsCatchImpl: RequestInterceptorsCatchType = error => {
  return Promise.reject(error)
}

const responseInterceptorsImpl: ResponseInterceptorsType = response => {
  return response
}

const responseInterceptorsCatchImpl: ResponseInterceptorsCatchType = async error => {
  if (isCancelError(error)) return Promise.reject(error)

  // const { data, config } = error.response || {}

  // const httpStatus = error.response?.status

  // //  如果处于刷新 token 的步骤 收集请求
  // if (refreshing) {
  //   return new Promise(resolve => {
  //     pendingTaskQueue.push({
  //       config,
  //       resolve
  //     })
  //   })
  // }

  // if (httpStatus === ResultEnum.UNAUTHORIZED) {
  //   refreshing = true
  //   await refreshToken()
  //   refreshing = false

  //   pendingTaskQueue.forEach(({ config, resolve }) => {
  //     resolve(mockService.request(config))
  //   })

  //   return mockService.request(config, {
  //     ignoreCancelRequest: true
  //   })
  // }

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

      throw errorJson
    }
  }
}

export const requestCatch: RequestTransform['requestCatch'] = (error, requestOptionsEx) => {
  const { ignoreErrorMessage = false } = requestOptionsEx

  if (isCancelError(error)) return error

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
