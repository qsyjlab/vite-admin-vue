/*
 * @Description: axios class type file
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-13 01:14:04
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-13 01:23:53
 * @FilePath: \vite-admin-vue\src\types\service\baseAxios.ts
 */

import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface InterceptorsType {
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorsCatch?: (error: any) => any
  responseInterceptors?: (response: AxiosResponse) => AxiosResponse
  responseInterceptorsCatch?: (error: any) => any
}

export interface CustomRequestConfig extends AxiosRequestConfig {
  interceptorsHooks?: InterceptorsType
  method?: VService.Method
}

export interface ResponseData<T = any> {
  data?: T
  code?: number
  msg?: string
}
