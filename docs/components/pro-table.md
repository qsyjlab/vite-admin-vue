# ProTable 高级表格



## Props 

| 属性       | 说明       | 类型                                                 | 默认值   |
| ---------- | ---------- | ---------------------------------------------------- | -------- |
| headerTitle | 工具栏左侧表头                                               | string \| slot      |          |
| options | 工具栏配置, 可根据需要具体显示                               | `TableOptions `\| boolean | true |
| columnsState | 列状态配置 | `ColumnsState` | {} |
| columns | 列配置                                                       | `ProTableColumns`   | [] |
| data                              | 静态数据源                                                   | Array                                             | [] |
| request | 数据请求函数                                                 | `(...rest: any[]) => Promise<any[]>`        |         |
| params                            | 数据请求参数                                                 | object | {} |
| transform                         | 数据请求响应结果处理器                                       | `(response: any) => { data: any[]; total: number }` |  |
| transformParams                   | 数据请求参数处理器，处理最终 params 与内部参数合并后的请求参数 | (params: any) => any |  |
| pagination                        | 分页相关配置 | `ProTablePaginationConfig` | boolean |
| checkable                         | checkbox 列开关                                              | boolean | false |
| selectedKeys/v-model:selectedKeys | checkbox 列选中的 rowKey | Array | [] |
| loading/v-model: loading          | 数据加载状态 ， | boolean | false |
| editable                          | 编辑模式下配置 | `ProTableEditable` | {} |

## columns 配置

| 属性         | 说明                                      | 类型                                                         | 可选值 | 默认值 |
| ------------ | ----------------------------------------- | ------------------------------------------------------------ | ------ | ------ |
| title        | 标题                                      | `number \| string `                                          |        |        |
| key          | 唯一标识, 同时作为 slot 注册向外暴露      | `number \|string `                                           |        |        |
| tip          | 标题 tips 提示                            |                                                              |        |        |
| valueType    | 内置渲染器类型                            | `ValueType`                                                  |        | text   |
| valueEnum    | 数值枚举                                  | `ValueEnum`                                                  |        |        |
| children     |                                           | 同自身配置                                                   |        |        |
| render       | 自定义渲染函数，支持组件渲染，功能同 slot | `(scope: ProTableSlotScope <T>) =>  number \| string \| undefined \| null \| VNode \| Component` |        |        |
| editable     | 是否可编辑                                | boolean                                                      |        |        |
| rowComponent | 编辑列组件配置                            | `ProTableEditRowComponent`                                   |        |        |

###  Type ProTableColumnItem

``` ts
export interface ProTableColumnItem<T = any>
  extends Partial<Omit<TableColumnCtx<T>, 'children' | 'label' | 'prop'>> {
  title?: number | string
  key: ColumnKey
  /** 创建一个提示图标 */
  tip?: string
  /** 当前数值类型 default: text */
  valueType?: ValueType
  /** 数值枚举 */
  valueEnum?: ValueEnum
  /** 是否可编辑 */
  editable?: boolean
  /** 编辑列组件配置 */
  rowComponent?: ProTableEditRowComponent
  /** 子集表头 */
  children?: ProTableColumnItem<T>[]
  /** 函数式渲染器 优先级小于 slot */
  render?: (scope: ProTableSlotScope<T>) => number | string | undefined | null | VNode | Component
}

export interface ProTableEditRowComponent {
  el: Component | string
  props?: Record<string, any>
  rules?: EditRowRule[]
}

export interface EditRowRule {
  required?: boolean
  message?: string
  validator?: (value: any, row: any, callback: (error?: string | Error) => void) => void
}
```

## columnsState 列状态配置 

| 属性            | 说明                                      | 类型                                                         | 可选值                        | 默认值       |
| --------------- | ----------------------------------------- | ------------------------------------------------------------ | ----------------------------- | ------------ |
| persistenceKey  | 持久化 key                                | string                                                       |                               |              |
| persistenceType | 持久化类型                                | string                                                       | localStorage\| sessionStorage | localStorage |
| value           | 列状态值                                  | `ColumnsMap`                                                 |                               | {}           |
| change          | 列状态变更回调                            | `(map: ColumnsMap) => void`                                  |                 

## pagination 配置

| 属性            | 说明                                      | 类型                                                         | 可选值                        | 默认值       |
| --------------- | ----------------------------------------- | ------------------------------------------------------------ | ----------------------------- | ------------ |
| page | 页码             | number   |                               | 1 |
| pageSize | 大小             | number                                                 |  | 10 |
| layout     | 分页器布局       | string[]                                       | 同 el-pagination |         |
| pageSizes  | 同 el-pagination | number[]                       |||
| background | 是否背景色       | boolean ||true|

### pagination 默认配置

``` ts
const DEFAULT_PAGINATON_CONFIG = {
  pageSizes: [10, 20, 30, 40],
  background: true,
  layout: ['total', 'sizes', 'prev', 'pager', 'next', 'jumper']
}
```

### Type ProTablePaginationConfig

``` ts
export interface ProTablePaginationConfig {
  page?: number
  pageSize?: number
  layout?: string[]
  pageSizes?: number[]
  background?: boolean
}
```



## editable 配置

| 属性     | 说明                                       | 类型                                                    | 可选值                | 默认值 |
| -------- | ------------------------------------------ | ------------------------------------------------------- | --------------------- | ------ |
| mode     | 单行编辑模式，多行编辑模式                 | string                                                  | `single \|  multiple` | single |
| onSave   | 保存回调，需 调用 next 函数                | `(row: any, next: () => void) => void`                  |                       |        |
| onCancel | 取消编辑回调，需 调用 next 函数            | `(row: any, next: () => void) => void`                  |                       |        |
| onDelete | 删除回调，需 调用 next 函数                | `(row: any, next: () => void) => void`                  |                       |        |
| onChange | 数据变更回调 ，onSave \| onDelete 执行过后 | `(data: any[]) => void`                                 |                       |        |
| onError  | 验证错误回调，返回当前行验证的所有错误信息 | `(errors: EditableCellValidError \| undefined) => void` |                       |        |

### Type ProTableEditable

``` ts
/** 编辑表格配置 */
export interface ProTableEditable {
  mode?: 'single' | 'multiple'
  onSave?: (row: any, next: () => void) => void
  onCancel?: (row: any, next: () => void) => void
  onDelete?: (row: any, next: () => void) => void
  onChange?: (data: any[]) => void
  onError?: (errors: EditableCellValidError | undefined) => void
}
export type EditableCellValidError = Record<string, { message: string }>

```

