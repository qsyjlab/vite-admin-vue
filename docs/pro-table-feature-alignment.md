# ProTable 功能对齐

新 `packages/pro-components/src/pro-table` 已完成旧组件功能并集迁移，旧目录和兼容入口均已删除。

## 核心能力

| 能力     | 旧 API                                 | 新 API                           | 状态                     |
| -------- | -------------------------------------- | -------------------------------- | ------------------------ |
| 本地数据 | `data`                                 | `data`                           | 已实现                   |
| 远程请求 | `request`、`params`、`autoRequest`     | 同名                             | 已实现并增加最后请求生效 |
| 响应转换 | `transform`                            | `responseAdapter`                | 已实现                   |
| 参数转换 | `transformParams`                      | 同名                             | 已实现                   |
| 分页     | `pagination`、`page-change(page,size)` | 同名，并增加 `pagination-change` | 已实现                   |
| Loading  | `loading`、`update:loading`            | 同名                             | 已实现，异常必定结束     |
| 自动高度 | `autoFitHeight`、`height`、`doHeight`  | 同名，内部使用 `ResizeObserver`  | 已实现                   |
| 工具栏   | `options.reload/density/setting`       | 同名                             | 已实现                   |
| 行拖拽   | 旧 `DragSortTable` 内部实现            | `dragSort` 下沉到 ProTable 核心  | 已实现                   |

## 列与渲染

| 能力             | 对齐策略                                         | 状态   |
| ---------------- | ------------------------------------------------ | ------ |
| 稳定列标识       | `key` 只负责渲染和列设置                         | 已实现 |
| 数据路径         | 新增独立 `dataIndex`；迁移期编辑列可回退到 `key` | 已实现 |
| 多级表头         | 递归 `children`                                  | 已实现 |
| 列提示           | `tip`                                            | 已实现 |
| 列显隐/排序/固定 | `columnsState`、本地持久化、重置                 | 已实现 |
| 序号列           | `indexBorder`                                    | 已实现 |
| 值类型与枚举     | 静态或动态 `valueType/valueEnum`，复用 ProField  | 已实现 |
| 自定义列插槽     | 以列 `key` 为插槽名                              | 已实现 |
| 函数渲染         | `render`、`customRenderAfter`                    | 已实现 |
| 全局 rendererMap | 迁移到 ProField 注册表与 ProConfigProvider       | 已实现 |

## 选择与编辑

| 能力                  | 对齐策略                                                  | 状态   |
| --------------------- | --------------------------------------------------------- | ------ |
| 行选择                | `checkable`、`selectedKeys`、`selection-change`           | 已实现 |
| 跨页选择              | `reserveSelection`、`cacheSelectedData`                   | 已实现 |
| 编辑模式              | `editable.mode` 单行/多行                                 | 已实现 |
| 编辑副本              | 开始编辑深拷贝，保存成功后才回写                          | 已实现 |
| 编辑器                | `rowComponent` 兼容；缺省时按 ProField `valueType` 渲染   | 已实现 |
| 校验                  | `enableValidate`、required、Promise 和 callback validator | 已实现 |
| 编辑回调              | `onSave/onCancel/onDelete` 使用返回值或 Promise           | 已实现 |
| 编辑事件              | `onChange/onError`、`update:data`、`editable-change`      | 已实现 |
| 编辑插槽              | scope 保留 `editableState`                                | 已实现 |
| 独立 ProEditableTable | 添加行、操作列、受控数据与完整示例                        | 已实现 |
| 快捷 ProDragSortTable | 自动补拖拽手柄列，排序引擎仍由 ProTable 提供              | 已实现 |

## 搜索桥接

| 能力             | 对齐策略                                              | 状态   |
| ---------------- | ----------------------------------------------------- | ------ |
| 独立搜索表单     | `ProTableSearch<TQuery>` 可脱离表格单独使用           | 已实现 |
| 显式列适配       | `columnsToSearchFields` 只转换明确标记的列            | 已实现 |
| 配置分离         | `splitProTableSearchColumns` 输出独立列和 Form schema | 已实现 |
| 空值清理         | 去除空字符串/null/undefined，保留 0 和 false          | 已实现 |
| 查询参数转换     | 支持字段 transform 和整体异步 transform               | 已实现 |
| 折叠、查询和重置 | 复用 ProForm 响应式栅格行、校验和 reset 后查询        | 已实现 |
| Ref API          | submit/reset/setFieldsValue/getFieldsValue/折叠控制   | 已实现 |
| ProTable 组合    | `ProTableWithSearch` 查询后自动回到第一页             | 已实现 |
| 查询请求去重     | 仅通过 params 响应触发一次表格请求                    | 已实现 |

## Ref 与兼容

新组件使用 `defineExpose()`、`useTemplateRef()` 和 `useProTable(ref)`。保留以下命令能力：

- `reload`、`refresh`、`clearSelection`、`clearSelectedKeys`、`doLayout`、`doHeight`
- `startEditable`、`cancelEditable`、`saveEditable`、`deleteEditable`
- `clearEditRows`、`hasEditingRow`、`getRowEditableState`
- `editableCellUtils`、`columnsSettingUtils` 分组能力对象

旧 `@register` 和旧组件入口已经删除。

## 核心与快捷封装边界

- `ProTable` 持有请求、分页、选择、编辑、行拖拽、列设置和高度计算等状态逻辑。
- `ProEditableTable` 只预设 editable、操作列和新增行，不实现第二套编辑状态。
- `ProDragSortTable` 只预设拖拽手柄列与本地受控数据，不初始化第二套排序引擎。
- `ProTableSearch` 只组合查询表单，分页和请求仍由 ProTable 负责。

## 内部架构

- `pro-table.vue` 只保留泛型 props、emits、slots、模板和样式，不直接维护业务状态。
- `store/use-pro-table-store.ts` 负责组合各项能力并生成统一的 `defineExpose` 契约。
- `hooks/` 按数据请求、列设置、选择、编辑、拖拽和高度计算拆分，能力之间通过显式参数和回调协作。
- 内部 store 与实现 hooks 不作为公共 API 导出；组件使用者通过 `useProTable(ref)` 操作实例。

## 验收状态

Provider 默认值、暗黑弹层、编辑器渲染、列设置、跨页选择、自动高度和新版 Ref 示例均已接入。
