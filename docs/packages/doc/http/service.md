# service 工作逻辑

文件夹位置位于 /src/service

```
 service
   ├── axios-request # 主要文件不涉及任何逻辑
        ├── axios-canceler # 主要文件不涉及任何逻辑
        ├── axios-request # 业务实现层
        ├── http-enum # 适配请求用，进行请求类的重写
        └── interface.ts # 相关类型 不涉及业务类型
        └── utils.ts
   ├── axios-request-impl # 业务实现层
   ├── request-adapter # 适配请求用，进行请求类的重写
   └── types # 相关类型 不涉及业务类型
   └── index.ts

```

本篇主要讲 `axios-request` 文件夹核心包

```ts
export type BaseAxiosRequestConfig = {
  baseURL?: AxiosRequestConfig['baseURL']
  timeout?: AxiosRequestConfig['timeout']
  headers?: AxiosRequestConfig['headers']
} & RequestConfigEx
interface RequestConfigEx {
  interceptorHooks?: InterceptorsType
  transform?: RequestTransform
}
```

### 创建

```ts
import { interceptorHooks, requestCatch, transformResponse } from './axios-request-impl'
import { RequestResultAdapter } from './request-adapter'

export const mockService = new RequestResultAdapter({
  interceptorHooks,
  baseURL: '/basic-api',
  transform: {
    transformResponse,
    requestCatch
  }
})
```

这里使用了 `RequestResultAdapter` 并不是原有的 `axios-request` 实例。因为各个业务的返回值格式并不同。针对类型传入需要每次都指定固定的类型。期望每次只需要传入当前的 类型。

例子：

```ts
{
    code: 200,
    data: null,
    msg: '成功'
}

对应的 ts 类型
export interface Result<T = any> {
    data?: T
    code?: number
    message?: string
}
```

然而这每次需要指定具体的

```ts
export function getMenuList() {
  return mockService.request<unknown, Result<RouteModule>>({
    url: '/getMenuList',
    method: 'get'
  })
}
```

`RequestResultAdapter` 只是做了类型的兼容，如果需要仍可以通过 第二个类型来覆盖

```ts
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
```

## transform 和 interceptorHooks

### interceptorHooks

类型：

```ts
export interface InterceptorsType {
  requestInterceptor?: requestInterceptorType
  requestInterceptorCatch?: requestInterceptorCatchType
  responseInterceptor?: responseInterceptorType
  responseInterceptorCatch?: responseInterceptorCatchType
}

export type requestInterceptorType = (
  // 这里使用的是最新版本的 axios 1.x 以上 与 0.x 类型并不是同一个
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
```

最终会被 `AxiosRequest` 注册

```ts
private registerInterceptors(): void {
    const {
      requestInterceptor,
      requestInterceptorCatch,
      responseInterceptor,
      responseInterceptorCatch
    } = this.instanceConfig.interceptorHooks || {}

    this.instance.interceptors.request.use(
      requestInterceptor,
      error => requestInterceptorCatch?.(error, this) ?? error
    )
    this.instance.interceptors.response.use(
      responseInterceptor,
      error => responseInterceptorCatch?.(error, this) ?? error
    )
}
```

### transform

这个属性是为了细化请求额外拓展出来的，你仍然可以使用拦截器来处理请求。

类型：

```ts
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
```
