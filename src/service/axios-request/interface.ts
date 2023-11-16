import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios'

export type BaseAxiosResponse = AxiosResponse<any>

export type RequestInterceptorsType = (
  config: InternalAxiosRequestConfig
) => InternalAxiosRequestConfig

export type RequestInterceptorsCatchType = (error: CatchError) => Promise<CatchError>

export type ResponseInterceptorsType = (response: BaseAxiosResponse) => BaseAxiosResponse

export type ResponseInterceptorsCatchType<T = any> = (error: CatchError<T>) => Promise<CatchError>

export type CatchError<T = any> = AxiosError<T>

export interface InterceptorsType {
  requestInterceptors?: RequestInterceptorsType
  requestInterceptorsCatch?: RequestInterceptorsCatchType
  responseInterceptors?: ResponseInterceptorsType
  responseInterceptorsCatch?: ResponseInterceptorsCatchType
}

export type BaseAxiosRequestConfig = {
  baseURL?: AxiosRequestConfig['baseURL']
  timeout?: AxiosRequestConfig['timeout']
  headers?: AxiosRequestConfig['headers']
} & RequestConfigEx
interface RequestConfigEx {
  interceptorsHooks?: InterceptorsType
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
