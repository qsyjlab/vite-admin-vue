# @vite-admin/pro-components

Vue 3.5 + Element Plus 的业务级 ProComponents。组件保持独立使用，同时共享字段渲染、请求生命周期、表单和表格基础能力。

## 使用

```ts
import { ProForm, ProTable } from '@vite-admin/pro-components'
import '@vite-admin/pro-components/style.css'
```

支持根入口和组件子路径入口：

```ts
import { ProTable } from '@vite-admin/pro-components/pro-table'
```

## Peer Dependencies

- Vue 3.5+
- Vue Router 4.5+
- Element Plus 2.9+
- `@element-plus/icons-vue`
- `lodash-es`
- `sortablejs`

`ProPreviewFile` 不直接依赖应用预览器。PDF、XLSX、DOCX 渲染器通过 `registerProPreviewFileRenderer()` 注册。

## 命令

- `pnpm build`：生成 ESM、类型声明和样式产物。
- `pnpm typecheck`：检查包内类型。
- `pnpm test`：运行包内单元测试。
- `pnpm lint`：检查包内源码。
