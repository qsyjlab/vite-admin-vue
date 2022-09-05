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

export interface ResponseData<T = unknown> {
  data: T
  code: number
  msg: string
}

// export type ResponseData<T = unknown> = T
