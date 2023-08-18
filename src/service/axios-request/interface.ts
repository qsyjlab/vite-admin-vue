import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export type BaseAxiosResponse = AxiosResponse<any>

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

export type BaseAxiosRequestConfig = AxiosRequestConfig & RequestConfigEx
interface RequestConfigEx {
  interceptorsHooks?: InterceptorsType
  transform?: RequestTransform
}

export type RequestMethodConfig = AxiosRequestConfig

export interface RequestOptionsEx {
  ignoreTransformRequest?: boolean
  ignoreTransformResponse?: boolean
  ignoreCancelRequest?: boolean
}

export type TransformResponse<T = any> = (response: AxiosResponse<T>) => AxiosResponse<T>['data']
export type TransformRequest<T = any> = (request: AxiosRequestConfig<T>) => AxiosRequestConfig<T>

export interface RequestTransform {
  transformResponse?: TransformResponse
  transformRequest?: TransformRequest
}
