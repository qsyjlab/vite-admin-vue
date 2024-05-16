import axios from 'axios'

import type { AxiosInstance } from 'axios'

import type {
  BaseAxiosRequestConfig,
  CatchError,
  RequestMethodConfig,
  RequestOptionsEx,
  UploadFileParams
} from './interface'

import { isFunction, extend } from '@/utils'
import { omit } from 'lodash-es'
import { AxiosCanceler } from './axios-canceler'

class AxiosRequest {
  private instanceConfig: BaseAxiosRequestConfig = {}

  private instance: AxiosInstance

  private canceler = new AxiosCanceler()

  // 初始化设置
  constructor(config: BaseAxiosRequestConfig) {
    this.instanceConfig = extend({}, config)

    this.instance = axios.create(this.instanceConfig)

    Object.defineProperties(this, {
      instanceConfig: { writable: false },
      instance: { writable: false, enumerable: false },
      canceler: { writable: false, enumerable: false, configurable: false }
    })
    this.registerInterceptors()
  }

  request<T = any>(
    options: RequestMethodConfig = {},
    requestOptions: RequestOptionsEx = {}
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const {
        ignoreTransformResponse = false,
        ignoreTransformRequest = false,
        ignoreCancelRequest = false
      } = requestOptions
      const { transformResponse, transformRequest, requestCatch } =
        this.instanceConfig.transform || {}

      let requestConfig = extend(omit(this.instanceConfig, ['transform', 'interceptors']), options)
      if (!ignoreTransformRequest && transformRequest && isFunction(transformRequest)) {
        requestConfig = transformRequest(requestConfig)
      }

      if (!ignoreCancelRequest) {
        this.canceler.addPending(requestConfig)
      }

      this.instance
        .request<T>(requestConfig)
        .then(response => {
          if (!ignoreTransformResponse && transformResponse && isFunction(transformResponse)) {
            try {
              const result = transformResponse(response, requestOptions)
              resolve(result)
            } catch (error: any) {
              reject(error)
            }
          }
          resolve(response.data)
        })
        .catch((error: Error | CatchError) => {
          if (requestCatch && isFunction(requestCatch)) {
            return reject(requestCatch(error, requestOptions))
          }
          reject(error)
        })
    })
  }

  /**
   * @description:  File Upload
   */
  uploadFile<T = any>(
    params: UploadFileParams,
    config?: RequestMethodConfig,
    requestOptions: RequestOptionsEx = {}
  ): Promise<T> {
    const formData = new FormData()
    const customFilename = params.name || 'file'

    formData.append(customFilename, params.file)

    if (params.data) {
      Object.keys(params.data).forEach(key => {
        const value = params.data?.[key]
        if (Array.isArray(value)) {
          value.forEach(item => {
            formData.append(`${key}[]`, item)
          })
          return
        }

        formData.append(key, params.data?.[key])
      })
    }

    return this.request<T>(
      {
        method: 'POST',
        ...config,
        data: formData
      },
      requestOptions
    )
  }

  // 注册拦截器
  private registerInterceptors(): void {
    const {
      requestInterceptor,
      requestInterceptorCatch,
      responseInterceptor,
      responseInterceptorCatch
    } = this.instanceConfig.interceptors || {}

    this.instance.interceptors.request.use(
      requestInterceptor,
      error => requestInterceptorCatch?.(error, this) ?? error
    )
    this.instance.interceptors.response.use(
      responseInterceptor,
      error => responseInterceptorCatch?.(error, this) ?? error
    )
  }
}

export default AxiosRequest
