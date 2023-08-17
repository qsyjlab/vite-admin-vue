import axios from 'axios'

import type { AxiosInstance } from 'axios'

import type {
  BaseAxiosRequestConfig,
  CatchError,
  RequestMethodConfig,
  RequestOptionsEx
} from './interface'

import { isFunction, extend } from '@/utils'
import { omit } from 'lodash-es'

class AxiosRequest {
  private instanceConfig: BaseAxiosRequestConfig = {}

  private instance: AxiosInstance

  // 初始化设置
  constructor(config: BaseAxiosRequestConfig) {
    this.instanceConfig = extend({}, config)

    this.instance = axios.create(this.instanceConfig)

    this.registerInterceptors()
  }

  request<T = any>(
    options: RequestMethodConfig = {},
    requestOptions: RequestOptionsEx = {}
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const { ignoreTransformResponse = false, ignoreTransformRequest = false } = requestOptions
      const { transformResponse, transformRequest } = this.instanceConfig.transform || {}

      let requestConfig = extend(
        omit(this.instanceConfig, ['transform', 'interceptorsHooks']),
        options
      )
      if (!ignoreTransformRequest && transformRequest && isFunction(transformRequest)) {
        requestConfig = transformRequest(requestConfig)
      }

      this.instance
        .request<T>(requestConfig)
        .then(response => {
          if (!ignoreTransformResponse && transformResponse && isFunction(transformResponse)) {
            try {
              const result = transformResponse(response)
              resolve(result)
            } catch (error: any) {
              reject(JSON.parse(error.message))
            }
          }
          resolve(response.data)
        })
        .catch((error: Error | CatchError) => {
          reject(error)
        })
    })
  }

  // 注册拦截器
  private registerInterceptors(): void {
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch
    } = this.instanceConfig.interceptorsHooks || {}

    this.instance.interceptors.request.use(requestInterceptors, requestInterceptorsCatch)
    this.instance.interceptors.response.use(responseInterceptors, responseInterceptorsCatch)
  }
}

export default AxiosRequest
