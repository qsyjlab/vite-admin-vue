/*
 * @Description: axios class type file
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-13 01:14:04
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 10:35:42
 * @FilePath: \vite-admin-vue\src\types\service\baseAxios.ts
 */

import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export type RequestInterceptorsType = (config: AxiosRequestConfig) => AxiosRequestConfig
export type CustomAxiosResponse = AxiosResponse<ResponseData<unknown>>

export type RequestInterceptorsCatchType = (error: CatchError) => CatchError

export type ResponseInterceptorsType = (response: CustomAxiosResponse) => CustomAxiosResponse

export type ResponseInterceptorsCatchType = (error: CatchError) => CatchError

export type CatchError = AxiosError

export interface InterceptorsType {
  requestInterceptors?: RequestInterceptorsType
  requestInterceptorsCatch?: RequestInterceptorsCatchType
  responseInterceptors?: ResponseInterceptorsType
  responseInterceptorsCatch?: ResponseInterceptorsCatchType
}

export interface CustomRequestConfig extends AxiosRequestConfig {
  interceptorsHooks?: InterceptorsType
}

// export interface ResponseData<T = unknown> {
//   data: T
//   code: number
//   msg: string
// }

export type ResponseData<T = unknown> = T
