# service 工作逻辑

文件夹位置位于 `src/service`，实际目录结构如下：

```
service
   ├── axios-request          # 核心实现层（不涉及业务逻辑）
   │    ├── __tests__/
   │    │    └── axios-canceler.test.ts
   │    ├── axios-canceler.ts  # 请求取消
   │    ├── axios-request.ts   # AxiosRequest 核心类
   │    ├── http-enum.ts       # 请求枚举（适配请求用）
   │    ├── index.ts           # 统一导出
   │    ├── interface.ts       # 相关类型定义（不涉及业务类型）
   │    └── utils.ts
   ├── axios-request-impl     # 业务实现层（拦截器、transform）
   │    ├── check-status.ts    # HTTP 状态码处理
   │    ├── helper.ts          # ResultEnum、showErrorMessage 等
   │    └── index.ts           # interceptors、transformResponse、requestCatch
   ├── request-adapter        # 适配层，进行请求类的重写
   │    └── index.ts           # RequestResultAdapter
   └── index.ts               # 导出三个 service 实例（basicApiService / service / fileService）
```

核心类型定义在 `axios-request/interface.ts`：

```ts
export type BaseAxiosRequestConfig = {
  baseURL?: AxiosRequestConfig['baseURL']
  timeout?: AxiosRequestConfig['timeout']
  headers?: AxiosRequestConfig['headers']
} & RequestConfigEx
interface RequestConfigEx {
  interceptors?: InterceptorsType
  transform?: RequestTransform
}
```

## service 实例

三个实例都在 `src/service/index.ts` 中创建，区别仅在于 `baseURL`：

```ts
import { interceptors, requestCatch, transformResponse } from './axios-request-impl'
import { RequestResultAdapter } from './request-adapter'
import config from '@/config'

export const basicApiService = new RequestResultAdapter({
  interceptors,
  baseURL: import.meta.env.VITE_APP_MOCK_API_BASE_URL, // /basic-api，供 mock 拦截
  transform: { transformResponse, requestCatch }
})

export const service = new RequestResultAdapter({
  interceptors,
  baseURL: config.baseApiUrl, // /proxy-api，走真实后端代理
  transform: { transformResponse, requestCatch }
})

export const fileService = new RequestResultAdapter({
  interceptors,
  baseURL: 'http://localhost:9002/', // 文件服务
  transform: { transformResponse, requestCatch }
})
```

## RequestResultAdapter

这里使用了 `RequestResultAdapter` 而不是直接用 `AxiosRequest` 实例。因为各个业务的返回值格式并不相同，针对类型传入每次都需要指定固定的类型。期望每次只需要传入当前的业务类型 `T`，自动包装为 `Api.Result<T>`。

统一返回结构示例：

```ts
{
  code: 200,
  data: null,
  message: '成功'
}
```

对应的 TS 类型（定义在 `typings/http.d.ts`，全局命名空间 `Api`）：

```ts
declare namespace Api {
  export interface Result<T = any> {
    data?: T
    code?: number
    message?: string
  }
}
```

`RequestResultAdapter` 的实现（`src/service/request-adapter/index.ts`）只是做了类型的兼容，把第二个泛型参数默认值设为 `Api.Result<T>`：

```ts
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
```

所以一般情况下只需指定业务类型：

```ts
export function login(data: Record<string, any>) {
  return basicApiService.request<UserModel>({
    url: '/login',
    method: 'post',
    data
  })
}
```

如果需要，仍可通过第二个泛型参数覆盖默认返回类型：

```ts
export function getMenuList() {
  return basicApiService.request<unknown, Api.Result<RouteModule>>({
    url: '/getMenuList',
    method: 'get'
  })
}
```

## transform 和 interceptors

### interceptors

类型：

```ts
export interface InterceptorsType {
  requestInterceptor?: requestInterceptorType
  requestInterceptorCatch?: requestInterceptorCatchType
  responseInterceptor?: responseInterceptorType
  responseInterceptorCatch?: responseInterceptorCatchType
}

export type requestInterceptorType = (
  // 这里使用的是最新版本的 axios 1.x 以上，与 0.x 类型并不是同一个
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

最终会被 `AxiosRequest` 注册：

```ts
private registerInterceptors(): void {
    const {
      requestInterceptor,
      requestInterceptorCatch,
      responseInterceptor,
      responseInterceptorCatch
    } = this.instanceConfig.interceptors || {}

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

业务实现位于 `axios-request-impl/index.ts`，例如请求拦截器会统一携带 token：

```ts
const requestInterceptorImpl: requestInterceptorType = config => {
  // 统一携带 token，便于后端识别当前用户（mock /getMenuList 依赖此 header）
  const token = getTokenCahce()
  if (token) {
    config.headers = config.headers || {}
    ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
  }
  return config
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

业务实现 `transformResponse`（`axios-request-impl/index.ts`）会根据返回体中的 `code` 判断成功/失败，失败时抛出错误并弹出提示：

```ts
export const transformResponse: RequestTransform['transformResponse'] = (
  response,
  requestConfigEx
) => {
  const { ignoreResponseErrorMessage = false } = requestConfigEx

  const { data: _data } = response
  const { code, message = '' } = _data || {}

  switch (code) {
    case ResultEnum.SUCCESS:
      return _data
    default: {
      const errorJson = {
        message: message || '服务器错误',
        code: code || -1,
        data: _data?.data ?? null
      }
      if (!ignoreResponseErrorMessage) {
        showErrorMessage(errorJson.message)
      }
      throw errorJson
    }
  }
}
```
