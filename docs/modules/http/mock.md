# Mock 数据

项目使用 [MSW (Mock Service Worker)](https://mswjs.io/) 做 mock，版本 `2.15`。MSW 通过 Service Worker 在网络层拦截请求并返回 mock 响应，对业务代码无侵入——`src/api` 下的接口定义无需区分 mock 与真实环境。

## 目录结构

```
src/mocks
   ├── data/                  # mock 数据与业务逻辑
   │    ├── auth.ts           # 用户认证（3 个账号 admin/editor/viewer，密码 123456）
   │    ├── order.ts          # 订单 CRUD
   │    ├── permission.ts     # 后端菜单数据（BACKED 模式用）
   │    └── user.ts           # 用户信息（向后兼容，重新导出 auth）
   ├── server/                # handler 注册
   │    ├── handlers.ts       # 所有 handler 定义，限定在 /basic-api/* 前缀
   │    ├── index.ts          # 统一导出
   │    └── utils.ts          # success / failure 响应体辅助函数
   ├── browser.ts             # 浏览器端 worker（setupWorker）
   ├── node.ts                # Node 端 server（setupServer，供 vitest 使用）
   └── index.ts               # 入口，根据 VITE_ENABLE_MOCK 决定是否启动
```

worker 脚本位于 `public/mockServiceWorker.js`，由 `npx msw init public/` 生成，需要随应用一起部署。

## 启动入口

入口在 `src/mocks/index.ts`，导出 `enableMock()`：

```ts
export async function enableMock() {
  const flag = import.meta.env.VITE_ENABLE_MOCK
  const enabled = flag === 'true' || (flag !== 'false' && import.meta.env.DEV)
  if (!enabled) return

  // 先清理旧 SW，避免残留注册干扰 MSW
  await cleanupLegacyWorkers()

  const { worker } = await import('./browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true
  })
}
```

在 `src/main.ts` 中，`app.mount` 之前 `await enableMock()`：

```ts
import { enableMock } from '@/mocks'

async function setupWebApp() {
  await enableMock()
  const app = createApp(App)
  // ... setupPlugins / setupStore / setupRouter ...
  app.mount(root)
}
```

## 开关说明（VITE_ENABLE_MOCK）

| 取值    | dev  | prod | 说明                                   |
| ------- | ---- | ---- | -------------------------------------- |
| `true`  | 启用 | 启用 | dev 和 prod 都启用 mock                |
| `false` | 关闭 | 关闭 | 完全关闭 mock，走真实后端              |
| 未设置  | 启用 | 关闭 | 仅 dev 启用，prod 关闭（兼容默认行为） |

判定逻辑：`flag === 'true' || (flag !== 'false' && import.meta.env.DEV)`。

- `env/.env` 默认 `VITE_ENABLE_MOCK = true`（dev+prod 都启用，便于本地预览）。
- `env/.env.prod` 默认 `VITE_ENABLE_MOCK = false`（生产关闭 mock，如需启用改为 `true`）。

## 工作原理

1. `enableMock()` 启动时，MSW 在浏览器注册 Service Worker（`public/mockServiceWorker.js`）。
2. handler 定义在 `src/mocks/server/handlers.ts`，统一以 `VITE_APP_MOCK_API_BASE_URL`（默认 `/basic-api`）为前缀，与 `basicApiService` 的 `baseURL` 一致：

```ts
// src/mocks/server/handlers.ts
import { http, HttpResponse } from 'msw'

const BASE = import.meta.env.VITE_APP_MOCK_API_BASE_URL || '/basic-api'

const loginHandler = http.post(`${BASE}/login`, async ({ request }) => {
  const body = (await request.json()) as Record<string, string>
  const user = findMockUser(String(body.username || ''), String(body.password || ''))
  return user
    ? HttpResponse.json(success(toLoginResponse(user)))
    : HttpResponse.json(failure('账号或密码错误'))
})

export const handlers = [loginHandler /* ...其它 handler */]
```

3. 未匹配 handler 的请求（如 `.vue` / `.js` / HMR / 真实接口）通过 `onUnhandledRequest: 'bypass'` 放行，原样转发到网络层，不返回 mock 响应。
4. Service Worker 会看到所有同源请求，但只对注册了 handler 的请求返回 mock 响应，其余原样转发。

> Node 端测试用 `src/mocks/node.ts` 的 `setupServer`，与浏览器共用同一套 handlers，详见文件内注释。

## 响应格式

统一为 `{ code, data, message }`，由 `src/mocks/server/utils.ts` 的 `success` / `failure` 生成：

```ts
export function success(data: unknown, message = '') {
  return { code: 200, data, message }
}

export function failure(message: string, code = 0, data: unknown = null) {
  return { code, data, message }
}
```

约定：

- `code: 200` 成功
- `code: 401` 未登录
- `code: 403` 无权限
- 其它非 200 表示业务错误，由 `transformResponse` 抛出并提示

## mock 数据

| 文件                           | 内容                                                                                                                                                                                               |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/mocks/data/auth.ts`       | 用户认证：3 个账号 `admin` / `editor` / `viewer`，密码均为 `123456`；支持三种权限模式（ROUTE_MAPPING / ROLE / BACKED）；提供 `findMockUser`、`findMockUserByToken`、`getBackendMenusByUsername` 等 |
| `src/mocks/data/order.ts`      | 订单 CRUD：`queryMockOrders`、`createMockOrder`、`updateMockOrder`、`deleteMockOrder`、`batchDeleteMockOrders`、`orderMeta` 等                                                                     |
| `src/mocks/data/permission.ts` | 后端菜单数据（BACKED 模式用）                                                                                                                                                                      |
| `src/mocks/data/user.ts`       | 用户信息（已 `@deprecated`，向后兼容重新导出 `auth`）                                                                                                                                              |

## 如何新增 mock

1. 在 `src/mocks/data/` 下新增数据文件（如 `product.ts`），实现数据与业务逻辑函数。
2. 在 `src/mocks/server/handlers.ts` 中用 `http.get` / `http.post` / `http.put` / `http.delete` 注册 handler，路径以 `/basic-api/` 开头（使用 `BASE` 常量拼接）：

```ts
import { http, HttpResponse } from 'msw'
import { success } from './utils'
import { queryProducts } from '../data/product'

const BASE = import.meta.env.VITE_APP_MOCK_API_BASE_URL || '/basic-api'

const listProductsHandler = http.get(`${BASE}/products`, ({ request }) => {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') || 1)
  return HttpResponse.json(success(queryProducts(page)))
})

export const handlers = [
  // ...已有 handler
  listProductsHandler
]
```

3. 对应的接口定义放在 `src/api/` 下，调用 `basicApiService.request<T>(...)`，`url` 与 handler 路径对应（不含 `BASE` 前缀，因为 `basicApiService` 的 `baseURL` 已是 `/basic-api`）：

```ts
// src/api/product.ts
import { basicApiService } from '@/service'

export function getProducts(page: number) {
  return basicApiService.request<{ list: Product[]; total: number }>({
    url: '/products',
    method: 'get',
    params: { page }
  })
}
```

## 注意事项

- MSW 的 Service Worker 会拦截所有同源请求（包括 `.vue` / `.js` / HMR），但 `onUnhandledRequest: 'bypass'` 会放行非 mock 请求，不影响正常开发与构建。
- prod 环境启用 mock 需确保 `public/mockServiceWorker.js` 被打包到产物中（默认随 `public/` 一同输出）。
- Mock 数据仅存在内存中，刷新页面后重置。
- 切换到真实后端联调时，把 `VITE_ENABLE_MOCK` 设为 `false`，并将接口调用从 `basicApiService` 改为 `service`（`baseURL` 为 `/proxy-api`）。
