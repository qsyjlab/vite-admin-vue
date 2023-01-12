import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export type BaseAxiosResponse = AxiosResponse<ResponseData<unknown>>

export type RequestInterceptorsType = (config: AxiosRequestConfig) => AxiosRequestConfig

export type RequestInterceptorsCatchType = (error: CatchError) => Promise<CatchError>

export type ResponseInterceptorsType = (response: BaseAxiosResponse) => BaseAxiosResponse

export type ResponseInterceptorsCatchType = (error: CatchError) => Promise<CatchError>

export type CatchError = AxiosError

export interface InterceptorsType {
  requestInterceptors?: RequestInterceptorsType
  requestInterceptorsCatch?: RequestInterceptorsCatchType
  responseInterceptors?: ResponseInterceptorsType
  responseInterceptorsCatch?: ResponseInterceptorsCatchType
}

export interface ResponseData<T = any> {
  data?: T
  code?: number
  message?: string
}

export type BaseAxiosRequestConfig = AxiosRequestConfig & RequestConfigEx
interface RequestConfigEx {
  interceptorsHooks?: InterceptorsType
  transform?: AxiosTransform
}

export type RequestMethodConfig = AxiosRequestConfig

export interface RequestOptionsEx {
  isTransformRequest?: boolean
  isTransformResponse?: boolean
}

export interface AxiosTransform {
  transformResponse: (response: AxiosResponse<ResponseData<any>>) => any
}
