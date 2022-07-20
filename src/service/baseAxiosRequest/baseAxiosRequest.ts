/*
 * @Description:
 * @Version:
 * @Autor: qsyj
 * @Date: 2022-03-13 00:49:54
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 10:45:43
 */
import axios, { AxiosResponse } from 'axios'

import type { AxiosInstance } from 'axios'

import type { InterceptorsType, CustomRequestConfig, ResponseData, CatchError } from './baseAxios'

class BaseAxios {
  private instanceConfig: CustomRequestConfig
  private instance: AxiosInstance
  private interceptors: InterceptorsType
  // 初始化设置
  constructor(config: CustomRequestConfig) {
    const { interceptorsHooks = {} } = config
    this.instanceConfig = {
      method: 'get',
      ...config
    }
    this.interceptors = interceptorsHooks
    this.instance = axios.create(this.instanceConfig)
    this.setInterceptors(this.instance)
  }

  setInterceptors(instance: AxiosInstance): void {
    instance.interceptors.request.use(
      this.interceptors?.requestInterceptors,
      this.interceptors?.requestInterceptorsCatch
    )
    // 添加响应拦截器
    instance.interceptors.response.use(
      this.interceptors.responseInterceptors,
      this.interceptors.responseInterceptorsCatch
    )
  }

  request<T = any>(options: CustomRequestConfig = {}): Promise<ResponseData<T>> {
    return this.instance
      .request<T>({
        ...this.instanceConfig,
        ...options
      })
      .then(response => response.data)
      .catch((error: CatchError) => Promise.reject(error))
  }
}
export default BaseAxios
