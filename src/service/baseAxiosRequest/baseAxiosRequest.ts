import axios from 'axios'

import type { AxiosInstance } from 'axios'

import type { InterceptorsType, CustomRequestConfig, ResponseData } from '@/types/service/baseAxios'

class BaseAxios {
  instanceConfig: CustomRequestConfig
  instance: AxiosInstance
  interceptors: InterceptorsType
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
    instance.interceptors.request.use(this.interceptors?.requestInterceptors, this.interceptors?.requestInterceptorsCatch)
    // 添加响应拦截器
    instance.interceptors.response.use(this.interceptors.responseInterceptors, this.interceptors.responseInterceptorsCatch)
  }

  request<T = any>(options: CustomRequestConfig = {}): Promise<T> {
    return this.instance
      .request<any, ResponseData<T>>({
        ...this.instanceConfig,
        ...options
      })
      .then((response: any): any => response.data)
  }
}
export default BaseAxios
