# @framebase/element-plus-pro-components

Vue 3.5 + Element Plus 的业务级 ProComponents。组件保持独立使用，同时共享字段渲染、请求生命周期、表单和表格基础能力。

## 使用

```ts
import { ProForm, ProTable } from '@framebase/element-plus-pro-components'
import '@framebase/element-plus-pro-components/style.css'
```

如需使用配套的 Element Plus 全局视觉主题，在组件样式之前引入：

```ts
import '@framebase/element-plus-theme/style.css'
import '@framebase/element-plus-pro-components/style.css'
```

支持根入口和组件子路径入口：

```ts
import { ProTable } from '@framebase/element-plus-pro-components/pro-table'
```

数据请求类组件统一暴露 `getRequestLifecycle()`、`getError()`、`retryRequest()` 和
`cancelRequest()`。`ProTable` 可通过 `urlState` 同步分页、排序和筛选状态；
`ProTreeSelect` 可通过 `request` 加载整树，通过 `pathRequest` 补全异步选中路径。

命令式调用使用 Vue 3.5 模板 Ref 与对应 Hook，例如 `useProTable()`、`useProSelect()`、
`useProForm()`、`useProQueryFilter()` 和 `useProTreeSelect()`，无需注册事件。

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
