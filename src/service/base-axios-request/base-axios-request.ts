import axios from 'axios'

import type { AxiosInstance } from 'axios'

import type {
  BaseAxiosRequestConfig,
  ResponseData,
  CatchError,
  RequestMethodConfig
} from './base-axios'
import { isFunction } from '@/utils'

class BaseAxios {
  private instanceConfig: BaseAxiosRequestConfig = {}

  private instance: AxiosInstance

  // 初始化设置
  constructor(config: BaseAxiosRequestConfig) {
    this.instanceConfig = { ...config }

    this.instance = axios.create(this.instanceConfig)

    this.registerInterceptors()
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

  request<T = any>(options: RequestMethodConfig = {}): Promise<ResponseData<T>> {
    return new Promise((resolve, reject) => {
      const transformResponse = this.instanceConfig.transform?.transformResponse
      this.instance
        .request<ResponseData<T>>({
          ...this.instanceConfig,
          ...options
        })
        .then(response => {
          if (!options.transformResponse && transformResponse && isFunction(transformResponse)) {
            try {
              const result = transformResponse(response)
              resolve(result)
            } catch (error: any) {
              reject(JSON.parse(error.message) || new Error('request error'))
            }

            return
          }
          resolve(response.data)
        })
        .catch((error: Error | CatchError) => {
          if (!options.transformResponse && transformResponse && isFunction(transformResponse)) {
            reject(JSON.parse(error.message))
            return
          }
          reject(error)
        })
    })
  }
}

export default BaseAxios
