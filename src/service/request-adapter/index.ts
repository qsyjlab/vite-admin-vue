import type {
  RequestMethodConfig,
  RequestOptionsEx,
  BaseAxiosRequestConfig
} from '../axios-request'
import { AxiosRequest } from '../axios-request'

// 为了适配同返回类型
export class RequestResultAdapter extends AxiosRequest {
  constructor(config: BaseAxiosRequestConfig) {
    super(config)
  }

  request<T = any, R = Api.Result<T>>(
    options?: RequestMethodConfig,
    requestOptions?: RequestOptionsEx
  ): Promise<R> {
    return super.request<R>(options, requestOptions)
  }
}
