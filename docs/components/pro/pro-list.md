# ProList

`ProList<TRecord, TQuery, TResponse>` 面向非表格记录：项目、文章、消息、任务和客户摘要。它不复用表格列配置，而是通过 `itemMeta` 或插槽组织内容。

```vue
<pro-list
  ref="listRef"
  v-model:selected-keys="selectedKeys"
  :request="getProjectPage"
  :item-meta="{ title: 'name', description: 'summary' }"
  :grid-columns="{ xs: 1, lg: 2 }"
  layout="grid"
  row-key="id"
  selectable
  reserve-selection
>
  <template #content="{ record }">
    <el-progress :percentage="record.progress" />
  </template>
</pro-list>
```

## 能力

- 本地数据或远程请求，支持取消、防抖、重试、最新请求生效及完整请求阶段状态。
- 本地/远程分页，以及 `responseAdapter`、`transformParams`。
- `list` / `grid` 布局和按容器宽度计算的响应式网格列数。
- 受控选择、跨页保留和已选记录读取。
- 泛型 `item/title/description/content/actions` 插槽。

## Ref API

`reload`、`refresh`、`getData`、`getLoading`、`getRequestLifecycle`、`getError`、`getTotal`、`getPageInfo`、`setPageInfo`、`getSelectedKeys`、`getSelectedRows`、`clearSelection`。

`request-state-change` 会同步 `{ phase, action, loading, initialLoading, refreshing }`，请求函数第二个参数提供 `{ signal, attempt }`。
