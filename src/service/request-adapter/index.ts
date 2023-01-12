import type {
  RequestMethodConfig,
  RequestOptionsEx,
  BaseAxiosRequestConfig
} from '../axios-request'
import { AxiosRequest } from '../axios-request'
import { Result } from '../types'

// 为了适配同返回类型
export class RequestResultAdapter extends AxiosRequest {
  constructor(config: BaseAxiosRequestConfig) {
    super(config)
  }

  request<T = any, R = Result<T>>(
    options?: RequestMethodConfig,
    requestOptions?: RequestOptionsEx
  ): Promise<R> {
    return super.request<R>(options, requestOptions)
  }
}
