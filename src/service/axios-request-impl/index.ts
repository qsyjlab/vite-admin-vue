import {
  RequestInterceptorsType,
  RequestInterceptorsCatchType,
  ResponseInterceptorsType,
  ResponseInterceptorsCatchType,
  InterceptorsType,
  RequestTransform,
  ResultEnum
} from '../axios-request'
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
      // 根据具体业务来确定默认值
      const errorJson = {
        message: message || '_',
        code: code || -1,
        data: null
      }
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

export const interceptorsHooks: InterceptorsType = {
  requestInterceptors: requestInterceptorsImpl,
  requestInterceptorsCatch: requestInterceptorsCatchImpl,
  responseInterceptors: responseInterceptorsImpl,
  responseInterceptorsCatch: responseInterceptorsCatchImpl
}

export const transformImpl: RequestTransform = {
  transformResponse
}
