# ProTable 高级表格

## 基本使用

:::demo
pro-table/basic
:::

## 网络请求

:::demo 通过 `request` 请求数据，`responseAdapter` 适配响应，`transformParams` 转换最终请求参数，`params` 传入业务查询条件。使用 `useTemplateRef()` 和 `useProTable()` 调用组件命令。
pro-table/request
:::

## 多级表头

:::demo 多级表头
pro-table/children
:::

## 展开行

:::demo

pro-table/expand
:::

## 可编辑行

:::demo 通过 `columns` 配置列 添加 `editable` 和 `rowComponent` 实现编辑行，通过 `ref` api 控制开启关闭编辑状态。 删除 ，保存，数据变更，验证错误等 可在 `ProTable` `editable` 属性中配置并做自定义操作。插槽可解构出 `editableState` 变量 包含 当前的编辑状态，行验证错误信息，缓存的数据 data，根据这个状态可以自定义插槽内容。
pro-table/editable
:::

## 内置渲染器

:::demo 可通过 `valueType` 和 `valueEnum` 快速渲染单元格。`valueEnum` 可以是一个函数，回调 行数据 可能根据行数据自定义 `valueEnum` 。
pro-table/renderer
:::

## Props

| 属性                              | 说明                                                           | 类型                                               | 默认值  |
| --------------------------------- | -------------------------------------------------------------- | -------------------------------------------------- | ------- |
| headerTitle                       | 工具栏左侧表头                                                 | string \| slot                                     |         |
| options                           | 工具栏配置, 可根据需要具体显示                                 | `TableOptions `\| boolean                          | true    |
| columnsState                      | 列状态配置                                                     | `ColumnsState`                                     | {}      |
| columns                           | 列配置                                                         | `ProTableColumns`                                  | []      |
| data                              | 静态数据源                                                     | Array                                              | []      |
| request                           | 数据请求函数，第二个参数包含 AbortSignal 与重试次数            | `(params, context) => Promise<TResponse>`          |         |
| params                            | 数据请求参数                                                   | object                                             | {}      |
| responseAdapter                   | 将自定义响应转换为标准数据                                     | `(response) => { data: TRecord[]; total: number }` |         |
| transformParams                   | 数据请求参数处理器，处理最终 params 与内部参数合并后的请求参数 | (params: any) => any                               |         |
| pagination                        | 分页相关配置                                                   | `ProTablePaginationConfig`                         | boolean |
| checkable                         | checkbox 列开关                                                | boolean                                            | false   |
| selectedKeys/v-model:selectedKeys | checkbox 列选中的 rowKey                                       | Array                                              | []      |
| loading/v-model:loading           | 数据加载状态                                                   | boolean                                            | false   |
| editable                          | 编辑模式下配置                                                 | `ProTableEditable`                                 | {}      |
| reserveSelection                  | 是否跨页保留选择                                               | boolean                                            | false   |
| cacheSelectedData                 | 跨页选择时预置的已选行                                         | Array                                              | []      |
| dragSort                          | 行拖拽排序配置                                                 | boolean \| `ProTableDragSort`                      | false   |
| requestDebounce                   | 请求防抖时间                                                   | number                                             | 0       |
| requestRetry                      | 失败自动重试次数                                               | number                                             | 0       |

## columns 配置

| 属性          | 说明                                 | 类型                                                  | 可选值 | 默认值 |
| ------------- | ------------------------------------ | ----------------------------------------------------- | ------ | ------ |
| title         | 标题                                 | `number \| string `                                   |        |        |
| key           | 列的稳定标识，同时作为 slot 名称     | string                                                |        |        |
| dataIndex     | 行数据读取路径，支持点路径和数组路径 | `ProDataIndex<TRecord>`                               |        |        |
| tip           | 标题 tips 提示                       |                                                       |        |        |
| valueType     | 内置渲染器类型                       | `ValueType`                                           |        | text   |
| valueEnum     | 数值枚举                             | `ValueEnum`                                           |        |        |
| children      | 多级表头子列                         | `ProTableColumn<TRecord>[]`                           |        |        |
| render        | 自定义渲染函数，优先级低于同名 slot  | `(scope: ProTableRenderScope<TRecord>) => VNodeChild` |        |        |
| editable      | 是否可编辑，可根据当前行动态计算     | boolean \| function                                   |        |        |
| editableRules | 编辑校验规则                         | `ProTableEditableRule[]`                              |        |        |
| rowComponent  | 编辑列组件配置                       | `ProTableEditRowComponent`                            |        |        |
| serverSort    | 开启服务端排序；字符串作为请求字段名 | boolean \| string                                     |        | false  |
| serverFilter  | 开启服务端筛选；字符串作为请求字段名 | boolean \| string                                     |        | false  |

服务端请求参数始终包含 `{ current, pageSize, sorter, filters }`。请求函数第二个参数提供 `{ signal, attempt }`，可直接传给 Fetch 或 Axios 实现真实取消。Ref 可通过 `setSorter()`、`setFilters()`、`resetServerState()` 和 `getRequestLifecycle()` 控制及读取服务端状态。

### Type ProTableColumn

```ts
export interface ProTableColumn<TRecord extends object, TValue = unknown> {
  key: string
  dataIndex?: ProDataIndex<TRecord>
  title?: string
  tip?: string
  valueType?: ValueType
  valueEnum?: ValueEnum
  editable?: boolean | ((scope: ProTableRenderScope<TRecord, TValue>) => boolean)
  editableRules?: ProTableEditableRule<TRecord, TValue>[]
  rowComponent?: ProTableEditRowComponent<TRecord, TValue>
  children?: ProTableColumn<TRecord>[]
  render?: (scope: ProTableRenderScope<TRecord, TValue>) => VNodeChild
}
```

## columnsState 列状态配置

| 属性            | 说明           | 类型                                  | 可选值                        | 默认值       |
| --------------- | -------------- | ------------------------------------- | ----------------------------- | ------------ |
| persistenceKey  | 持久化 key     | string                                |                               |              |
| persistenceType | 持久化类型     | string                                | localStorage\| sessionStorage | localStorage |
| value           | 受控列状态值   | `Record<string, ProTableColumnState>` |                               | {}           |
| onChange        | 列状态变更回调 | `(state) => void`                     |                               |              |

## pagination 配置

| 属性       | 说明             | 类型               | 可选值           | 默认值 |
| ---------- | ---------------- | ------------------ | ---------------- | ------ |
| page       | 页码             | number             |                  | 1      |
| pageSize   | 大小             | number             |                  | 10     |
| layout     | 分页器布局       | string \| string[] | 同 el-pagination |        |
| pageSizes  | 同 el-pagination | number[]           |                  |        |
| background | 是否背景色       | boolean            |                  | true   |

### pagination 默认配置

```ts
const DEFAULT_PAGINATON_CONFIG = {
  pageSizes: [10, 20, 30, 40],
  background: true,
  layout: ['total', 'sizes', 'prev', 'pager', 'next', 'jumper']
}
```

### Type ProTablePaginationConfig

```ts
export interface ProTablePaginationConfig {
  current?: number
  pageSize?: number
  layout?: string | string[]
  pageSizes?: number[]
  background?: boolean
  small?: boolean
  popperClass?: string
  teleported?: boolean
}
```

## editable 配置

| 属性           | 说明                                                  | 类型                                       | 可选值               | 默认值 |
| -------------- | ----------------------------------------------------- | ------------------------------------------ | -------------------- | ------ |
| mode           | 单行编辑模式，多行编辑模式                            | string                                     | `single \| multiple` | single |
| enableValidate | 保存前是否执行字段校验                                | boolean                                    |                      | true   |
| onSave         | 保存回调；返回记录可替换当前行，返回 false 可阻止保存 | `(row) => result \| Promise<result>`       |                      |        |
| onCancel       | 取消回调；返回 false 可阻止取消                       | `(row) => void \| boolean \| Promise<...>` |                      |        |
| onDelete       | 删除回调；返回 false 可阻止删除                       | `(row) => void \| boolean \| Promise<...>` |                      |        |
| onChange       | 保存或删除后返回最新数据                              | `(data: TRecord[]) => void`                |                      |        |
| onError        | 返回当前行验证错误                                    | `(errors: ProTableEditableErrors) => void` |                      |        |

### Type ProTableEditable

```ts
/** 编辑表格配置 */
export interface ProTableEditable<TRecord extends object> {
  mode?: 'single' | 'multiple'
  enableValidate?: boolean
  onSave?: (row: TRecord) => void | boolean | TRecord | Promise<void | boolean | TRecord>
  onCancel?: (row: TRecord) => void | boolean | Promise<void | boolean>
  onDelete?: (row: TRecord) => void | boolean | Promise<void | boolean>
  onChange?: (data: TRecord[]) => void
  onError?: (errors: ProTableEditableErrors | undefined) => void
}
```
