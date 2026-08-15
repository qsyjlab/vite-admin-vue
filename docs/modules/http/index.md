# 接口联调

## 环境变量

项目启动时 Vite 会从 `env/` 目录读取环境变量，不同环境通过 `--mode` 指定不同的 `.env.[mode]` 文件（如 `env/.env`、`env/.env.prod`）。

与接口请求相关的环境变量：

| 变量名                       | 说明                                                | 默认值                                      |
| ---------------------------- | --------------------------------------------------- | ------------------------------------------- |
| `VITE_APP_API_BASE_URL`      | 真实后端代理路径，由 Vite `server.proxy` 转发到后端 | `/proxy-api`                                |
| `VITE_APP_MOCK_API_BASE_URL` | mock 拦截路径，供 MSW 拦截                          | `/basic-api`                                |
| `VITE_ENABLE_MOCK`           | mock 开关，详见 [Mock 数据](./mock.md)              | 未设置（仅 dev 启用）                       |
| `SERVER_PROXY_LIST`          | Vite `server.proxy` 配置，JSON 二维数组格式         | `[["/proxy-api", "http://localhost:9002"]]` |

`env/.env` 示例：

```txt
# api 路径
VITE_APP_API_BASE_URL = "/proxy-api"

# 本地 mock api 路径，由 MSW 拦截处理
VITE_APP_MOCK_API_BASE_URL = "/basic-api"

# 是否启用 mock（true: dev+prod 都启用 | false: 完全关闭 | 未设置: 仅 dev 启用）
VITE_ENABLE_MOCK = true

# vite server.proxy
SERVER_PROXY_LIST = [["/proxy-api", "http://localhost:9002"]]
```

`SERVER_PROXY_LIST` 会被 `vite.config.ts` 中的 `createProxy(viteEnvs.SERVER_PROXY_LIST)` 解析，生成 `server.proxy` 配置，把 `/proxy-api` 开头的请求代理到 `http://localhost:9002`。

环境变量最终会聚合到 `src/config/index.ts`：

```ts
import { defineConfig } from './types'

const VITE_EVN = import.meta.env

export default defineConfig({
  publicBaseUrl: import.meta.env.BASE_URL,
  baseApiUrl: VITE_EVN.VITE_APP_API_BASE_URL,
  casBaseUrl: VITE_EVN.VITE_CAS_BASE_URL,
  projectTitle: VITE_EVN.VITE_APP_TITLE,
  projectDesc: VITE_EVN.VITE_APP_DESC,
  enableSSO: VITE_EVN.VITE_ENABLE_SSO,
  docxLink: 'https://qsyjlab.github.io/vite-admin-vue/',
  storage: {
    prefix: '_BASIC_'
  }
})
```

## service 实例

接口请求基于 `axios` 封装，所有 service 实例从 `src/service/index.ts` 导出：

- `basicApiService`：`baseURL` 为 `VITE_APP_MOCK_API_BASE_URL`（默认 `/basic-api`），供 MSW 拦截，命中 mock handler 时返回 mock 数据。
- `service`：`baseURL` 为 `config.baseApiUrl`（即 `VITE_APP_API_BASE_URL`，默认 `/proxy-api`），走真实后端代理。
- `fileService`：文件服务，`baseURL` 硬编码为 `http://localhost:9002/`。

```ts
// src/service/index.ts
import { interceptors, requestCatch, transformResponse } from './axios-request-impl'
import { RequestResultAdapter } from './request-adapter'
import config from '@/config'

export const basicApiService = new RequestResultAdapter({
  interceptors,
  baseURL: import.meta.env.VITE_APP_MOCK_API_BASE_URL,
  transform: { transformResponse, requestCatch }
})

export const service = new RequestResultAdapter({
  interceptors,
  baseURL: config.baseApiUrl,
  transform: { transformResponse, requestCatch }
})

export const fileService = new RequestResultAdapter({
  interceptors,
  baseURL: 'http://localhost:9002/',
  transform: { transformResponse, requestCatch }
})
```

> 三个实例的区别仅在于 `baseURL`。开发联调时用 `basicApiService` 配合 mock；切换到真实后端时改用 `service`。具体工作逻辑见 [service 工作逻辑](./service.md)。

## 接口定义规范

1. 接口统一定义在 `src/api` 下，按业务模块分文件（如 `user.ts`、`order.ts`、`permission.ts`）。
2. 相关的 TypeScript 类型定义可放在同目录，命名为 `xxx-types.ts`（如 `order-types.ts`），也可按需在文件内联。
3. 统一返回结构为 `{ code, data, message }`，对应类型为全局命名空间 `Api.Result<T>`（定义在 `typings/http.d.ts`）：

```ts
declare namespace Api {
  export interface Result<T = any> {
    data?: T
    code?: number
    message?: string
  }
}
```

`RequestResultAdapter.request<T>` 已自动把返回值包装为 `Api.Result<T>`，所以一般情况下只需指定业务类型 `T`：

```ts
// src/api/user.ts
import { basicApiService } from '@/service'
import type { UserModel } from '@/mocks/data/user'

export function login(data: Record<string, any>) {
  return basicApiService.request<UserModel>({
    url: '/login',
    method: 'post',
    data
  })
}

export function getUauth() {
  return basicApiService.request<UserModel>({
    url: '/uauth',
    method: 'get'
  })
}
```

如需覆盖默认的返回类型，可通过第二个泛型参数显式指定：

```ts
// src/api/permission.ts
import { basicApiService } from '@/service'
import type { RouteModule } from '@/mocks/data/permission'

export function getMenuList() {
  return basicApiService.request<unknown, Api.Result<RouteModule>>({
    url: '/getMenuList',
    method: 'get'
  })
}
```

> 这里只展示使用示例，具体的工作逻辑见下一篇 [service 工作逻辑](./service.md)。Mock 相关说明见 [Mock 数据](./mock.md)。
