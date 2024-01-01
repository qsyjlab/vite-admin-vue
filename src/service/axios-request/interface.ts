import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios'
import AxiosRequest from './axios-request'

export type BaseAxiosResponse = AxiosResponse<any>

export type requestInterceptorType = (
  config: InternalAxiosRequestConfig
) => InternalAxiosRequestConfig

export type requestInterceptorCatchType = (
  error: CatchError,
  instance: AxiosRequest
) => Promise<CatchError>

export type responseInterceptorType = (response: BaseAxiosResponse) => BaseAxiosResponse

export type responseInterceptorCatchType<T = any> = (
  error: CatchError<T>,
  instance: AxiosRequest
) => Promise<CatchError>

export type CatchError<T = any> = AxiosError<T>

export interface InterceptorsType {
  requestInterceptor?: requestInterceptorType
  requestInterceptorCatch?: requestInterceptorCatchType
  responseInterceptor?: responseInterceptorType
  responseInterceptorCatch?: responseInterceptorCatchType
}

export type BaseAxiosRequestConfig = {
  baseURL?: AxiosRequestConfig['baseURL']
  timeout?: AxiosRequestConfig['timeout']
  headers?: AxiosRequestConfig['headers']
} & RequestConfigEx
interface RequestConfigEx {
  interceptorHooks?: InterceptorsType
  transform?: RequestTransform
}

export type RequestMethodConfig = AxiosRequestConfig

export interface RequestOptionsEx {
  /** 忽略 transformRequest 不执行 */
  ignoreTransformRequest?: boolean
  /** 忽略 transformResponse 不执行 */
  ignoreTransformResponse?: boolean
  /** 忽略 cancel */
  ignoreCancelRequest?: boolean
  /** 忽略 错误提示 弹出 */
  ignoreErrorMessage?: boolean
  /** 忽略 业务状态错误提示 弹出 */
  ignoreResponseErrorMessage?: boolean
}

export type TransformResponse<T = any> = (
  response: AxiosResponse<T>,
  requestOptionsEx: RequestOptionsEx
) => AxiosResponse<T>['data']
export type TransformRequest<T = any> = (request: AxiosRequestConfig<T>) => AxiosRequestConfig<T>

export type RequestCatch = (error: Error, requestOptionsEx: RequestOptionsEx) => Error

export interface RequestTransform {
  transformResponse?: TransformResponse
  transformRequest?: TransformRequest
  requestCatch?: RequestCatch
}

// multipart/form-data: upload file
export interface UploadFileParams {
  // Other parameters
  data?: Record<string, any>
  // File parameter interface field name
  name?: string
  // file name
  file: File | Blob
  // file name
  filename?: string
  [key: string]: any
}
