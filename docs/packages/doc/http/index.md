# 接口联调

## 开发环境配置

项目启动时 vite 默认读取 `/env/.env` 下的环境变量

```txt
# 信息
VITE_APP_TITLE= Vite Admin Vue
VITE_APP_DESC= Vite Admin Vue 是一个中后台管理系统模版

# api路径
VITE_APP_API_BASE_URL = "/"
```

最终结果会被保存到 `src/config/index.ts` 文件夹下。

```ts
import { defineConfig } from './types'

const VITE_EVN = import.meta.env

export default defineConfig({
  baseApiUrl: VITE_EVN.BASE_URL,
  projectTitle: VITE_EVN.VITE_APP_TITLE,
  projectDesc: VITE_EVN.VITE_APP_DESC,
  storagePrefix: '_BASIC_'
})
```

不同的环境根据不同的 mode 来指定不同的 `.env.mode`

## 接口请求

1. 接口请求基于 `axios` 封装
2. 本地测试环境，使用 `mock` 来模拟数据，禁止线上使用 `mock` 环境
3. 接口统一定义 src/api 文件夹下
4. 相关 api 的 ts 类型定义在 src/api/model 下，也可以直接放在 /src/model 中

```ts
import { mockService } from '@/service'
import { RouteModule } from '~/mock/permission'
import { Result } from '@/service/types/result'

export function getMenuList() {
  return mockService.request<Result<RouteModule>>({
    url: '/getMenuList',
    method: 'get'
  })
}
```

> 这里只展示使用示例 单独 在下一篇章解释具体的工作逻辑
