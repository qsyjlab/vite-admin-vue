# ProTree / ProTreeSelect

`ProTree<TNode>` 用于树形浏览、搜索、勾选和远程数据加载；`ProTreeSelect<TNode>` 用于表单中的树形选择，并支持异步选中路径回显。两者共享字段映射与请求生命周期。

## ProTree

```vue
<pro-tree
  ref="treeRef"
  v-model="checkedKeys"
  v-model:current-key="currentKey"
  :request="requestOrganization"
  :fields="{ key: 'id', label: 'name', children: 'children' }"
  node-key="id"
  checkable
  searchable
/>
```

`request(context)` 接收 `{ signal, attempt }`，组件支持最新请求生效、取消、重试、错误保留和卸载取消。刷新失败且已有数据时保留旧树并显示错误提示；首次请求失败时显示 `ProEmpty error`。

### Props

| 属性                                                     | 说明                                            |
| -------------------------------------------------------- | ----------------------------------------------- |
| `data`                                                   | 静态树数据；没有请求结果时使用                  |
| `fields`                                                 | `key`、`label`、`children`、`disabled` 字段映射 |
| `modelValue`                                             | 受控勾选 key，支持 `v-model`                    |
| `currentKey`                                             | 当前节点 key，支持 `v-model:current-key`        |
| `checkable` / `searchable`                               | 是否显示勾选与搜索                              |
| `lazy` / `load`                                          | Element Plus 懒加载入口                         |
| `request`                                                | 远程整树请求                                    |
| `requestDebounce` / `requestRetry` / `requestRetryDelay` | 请求控制                                        |
| `loading`                                                | 外部加载状态                                    |
| `emptyText` / `errorText` / `retryText`                  | 空态和错误态文案                                |

### Events 与 Slots

- `check(nodes, keys)`、`select(data, key)`。
- `request-success(data)`、`request-state-change(lifecycle)`、`request-error(error)`。
- `#default` 自定义节点；`#empty` 自定义空态；`#error="{ error, retry }"` 自定义错误态。

### Ref 与 Hook

`ProTreeInstance<TNode>` 暴露 `getTree()`、`getData()`、`reload()`、`retryRequest()`、`cancelRequest()`、`getRequestLifecycle()`、`getError()`、`filter()`、勾选 getter/setter、当前节点 getter/setter 以及 `expandAll()` / `collapseAll()`。

使用 `useTemplateRef<ProTreeInstance<TNode>>()` 与 `useProTree()` 代理命令式方法，不需要注册事件。

## ProTreeSelect

```vue
<pro-tree-select
  ref="treeSelectRef"
  v-model="memberId"
  :request="requestOrganization"
  :path-request="requestSelectedPath"
  :fields="{ key: 'id', label: 'name', children: 'children' }"
  node-key="id"
/>
```

- `request(context)` 加载整树。
- `pathRequest(value, context)` 返回当前选中节点及其父路径，结果写入 TreeSelect `cache-data`，用于整树尚未加载时的 label 回显。
- Ref 提供 `getData()`、`getCacheData()`、`reload()`、`reloadPath()` 和统一请求控制方法。
- `useProTreeSelect()` 提供类型安全的模板 Ref 代理。

## 设计边界

- `ProTree` 负责浏览、搜索和勾选；`ProTreeSelect` 负责表单值选择。
- 业务权限计算、服务端节点搜索和节点增删改不内置，由调用方通过请求、插槽和事件组合。
- 所有视觉颜色使用 Element Plus 变量，错误、空数据和暗黑模式不依赖应用级固定颜色。
