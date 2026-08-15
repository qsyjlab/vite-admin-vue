# ProComponents 实施计划

## 1. 目标与边界

本次重构参考 Ant Design ProComponents 的能力分层，但不照搬 React API。实现以 Vue 3.5、Element Plus 和当前项目的使用习惯为基础。

核心目标：

- 每个组件可以独立安装、导入和使用，不要求必须组合 `ProForm` 或 `ProTable`。
- 表格列配置与表单字段配置相互独立，只有显式使用桥接能力时才发生转换。
- 所有通用 SFC 从组件内部声明泛型，并将泛型贯穿 props、emits、slots、expose 和 hooks。
- 组件实例统一通过 `defineExpose()` 暴露；父组件优先使用 Vue 3.5 `useTemplateRef()`。
- `useProXxx()` 是可选的类型代理，不作为组件正常工作的前置条件。
- 公共能力下沉到字段、数据路径、请求状态和配置层，禁止组件之间复制请求与映射逻辑。
- 新文件名全部使用小写短横线格式；组件文件使用 `pro-xxx.vue`。

不在本轮 ProComponents 迁移范围内：`ProIcon`、`ProEcharts`、`ProTinymce`、`ProContextMenu`。它们属于通用部件，不属于字段、表单和数据展示体系。

## 2. 配置模型

### 2.1 三种稳定标识

| 字段        | 所属范围         | 含义                                         |
| ----------- | ---------------- | -------------------------------------------- |
| `key`       | Vue 渲染、列设置 | 稳定且唯一的配置标识，不承担取值职责         |
| `dataIndex` | 表格、描述列表   | 数据读取路径，支持点路径和数组路径           |
| `name`      | 表单             | 表单模型字段路径，遵循 Element Plus 表单语义 |

三者可以取相同值，但不能在类型和运行时实现中视为同一个概念。

### 2.2 独立配置

- `ProTableColumn<TRecord>` 只描述列、数据展示、筛选和编辑入口。
- `ProFormField<TModel>` 只描述字段、校验、布局和表单交互。
- `ProTableSearch` 可以从列配置生成默认搜索项，但允许通过 `searchField` 覆盖或完全传入独立表单配置。
- 列到字段的转换由独立适配器完成，转换结果必须可修改，不允许在 `ProForm` 内隐式读取表格上下文。

## 3. 目录与公共导出

多包职责与依赖边界见 [ProComponents 多包架构](./pro-components-package-architecture.md)。

```text
packages/pro-components/src/
  index.ts
  shared/
    pro-path.ts
    pro-request.ts
  pro-field/
    index.ts
    pro-field.vue
    pro-field.ts
  pro-select/
    index.ts
    pro-select.vue
    pro-select.ts
    use-pro-select.ts
  pro-radio-group/
    index.ts
    pro-radio-group.vue
  pro-checkbox-group/
    index.ts
    pro-checkbox-group.vue
  pro-upload/
  pro-upload-list/
  pro-form/
  pro-modal-form/
  pro-drawer-form/
  pro-steps-form/
  pro-table/
  pro-editable-table/
  pro-table-search/
  pro-descriptions/
  pro-config-provider/
  pro-card/
  pro-list/
  pro-preview-file/
  pro-empty/
  pro-result/
  pro-check-card/
  pro-tree/
  pro-query-filter/
```

同名旧组件目录直接删除，业务入口、自动导入和示例统一切换到 `@framebase/element-plus-pro-components`。不保留重新导出、`legacy` 包装或 `@deprecated` 过渡 API。

## 4. 泛型与类型约束

### 4.1 SFC 泛型

通用组件必须从 SFC 内部声明泛型，例如：

```vue
<script
  setup
  lang="ts"
  generic="TOption extends object = ProSelectOption, TValue extends ProSelectValue = ProSelectValue, TMultiple extends boolean = false"
>
```

最低传递范围：

- `defineProps<T>()`
- `defineModel<T>()` 或 `defineEmits<T>()`
- `defineSlots<T>()`
- 内部 composable
- `defineExpose<T>()`
- 对外 `ProXxxInstance<T>` 和 `useProXxx<T>()`

### 4.2 数据路径

- 对象点路径推导默认最多四层，避免递归类型拖慢 IDE 和 `vue-tsc`。
- 允许数组路径承载动态索引与 Element Plus 的字段路径。
- 路径推导只提供提示，不应阻止服务端动态字段；开放字符串通过 `LiteralUnion` 兼容。
- 内部读取路径统一使用结构化路径函数，不在组件中重复 `split('.')`。

### 4.3 类型原则

- 默认使用 `unknown`，仅在 Element Plus 原始类型无法收窄的边界使用局部类型断言。
- 记录类型、查询参数、响应类型、字段值类型分别声明，不复用一个宽泛的 `Record<string, any>`。
- 组件公开类型不得包含实现拼写错误；错误字段在迁移时直接修正并同步调用方。

## 5. Ref 与 Hooks 契约

每个有命令式行为的组件定义 `ProXxxExpose`：

- 组件内使用 `defineExpose()`。
- 父组件使用 `useTemplateRef<ProXxxInstance>()` 获取实例。
- `useProXxx(ref)` 接收模板 ref，并代理常用方法。
- Hook 不创建隐藏注册通道，不依赖组件触发 `@register`。
- ProForm 的 `register` 已完成仓库内迁移并删除；其他组件统一使用相同的模板 Ref 契约。

示例：

```ts
const selectRef = useTemplateRef<ProSelectInstance<UserOption>>('selectRef')
const select = useProSelect(selectRef)

await select.reload()
await select.focus()
```

## 6. 组件能力清单

| 组件                | 独立能力                                 | 组合能力                             |
| ------------------- | ---------------------------------------- | ------------------------------------ |
| `ProConfigProvider` | 全局字段映射、请求结果适配、默认 token   | 为所有 Pro 组件提供可覆盖默认值      |
| `ProCard`           | 标题、折叠、加载、分割和响应式分组       | 工作台和详情页内容分组               |
| `ProStatisticCard`  | 指标、趋势、精度、前后缀和图表插槽       | 组合工作台指标区域                   |
| `ProList`           | 请求、分页、列表/网格、选择和错误重试    | 项目、任务、消息等非表格记录         |
| `ProField`          | valueType 渲染、空值、枚举、只读/编辑态  | Form/Table/Descriptions 共享字段渲染 |
| `ProSelect`         | 静态/远程选项、分组、竞态保护、字段映射  | 被 ProField 和 ProForm 使用          |
| `ProRadioGroup`     | 泛型选项、字段映射、按钮/单选模式        | 被 ProField 和 ProForm 使用          |
| `ProCheckboxGroup`  | 泛型多选、字段映射                       | 被 ProField 和 ProForm 使用          |
| `ProUpload`         | 上传生命周期、限制、校验、自定义请求     | 被 ProForm 使用                      |
| `ProUploadList`     | 文件列表、预览、下载、移除               | 与 ProUpload 可选组合                |
| `ProForm`           | 独立 schema/model、校验、依赖、布局、Ref | 承载 Modal/Drawer/Steps Form         |
| `ProModalForm`      | 弹窗生命周期、提交、关闭保护             | 可接受 ProForm 配置或插槽            |
| `ProDrawerForm`     | 抽屉生命周期、提交、关闭保护             | 可接受 ProForm 配置或插槽            |
| `ProStepsForm`      | 分步状态、分步校验、数据汇总             | 多个独立 ProForm 的协调器            |
| `ProTable`          | 请求、分页、列设置、选择、自动高度       | 可选接入 Search/Editable/Field       |
| `ProEditableTable`  | 行编辑、校验、保存与撤销                 | 基于 ProTable 的显式扩展             |
| `ProTableSearch`    | 查询表单、重置、参数转换                 | ProTable 与 ProForm 的桥接层         |
| `ProDescriptions`   | 泛型数据路径、响应式列、字段渲染         | 复用 ProField                        |
| `ProPreviewFile`    | 文件类型识别、预览状态和错误态           | Upload 系列可选调用                  |
| `ProEmpty`          | 空数据、无结果、请求失败和重试操作       | 数据组件、预览和 CRUD 页面统一反馈   |
| `ProResult`         | 成功、异常、权限和服务状态反馈           | 403/404/500 与业务结果页             |
| `ProCheckCard`      | 卡片式单选/多选、键盘和表单校验          | 套餐、权限和功能模块配置             |
| `ProTree`           | 树请求、搜索、选中、错误保留和重试       | 组织树与 TreeSelect 数据源           |
| `ProTreeSelect`     | 异步路径回显、懒加载和 Ref/Hook          | 表单中的层级数据选择                 |
| `ProQueryFilter`    | 查询条件折叠、计数、清空和参数桥接       | ProForm/ProTableSearch 可选组合      |

## 7. 分阶段实施

### 阶段 0：契约与基线

- [x] 建立本实施计划。
- [x] 确认命名、独立性、泛型、Ref 和迁移策略。
- [x] 为请求状态、数据路径、表单值/错误/折叠和表格编辑建立最小回归测试基线。

验收：文档中的类型和目录约束可以直接用于代码审查。

### 阶段 1：基础层与选择类组件

- [x] 建立 `pro-components` 根入口。
- [x] 实现限深数据路径与运行时取值工具。
- [x] 实现具备最新请求获胜语义的请求状态 Hook。
- [x] 重构泛型 `ProSelect`，并将调用方切换到新入口。
- [x] 迁移 `ProRadioGroup` 与 `ProCheckboxGroup`。
- [x] 建立 `ProField` valueType 注册与只读/编辑渲染。

验收：组件可单独导入；远程请求无竞态覆盖；外部 `remoteMethod` 生效；切换 `multiple` 不修改 model；类型检查通过。

### 阶段 2：上传组件

- [x] 迁移 `ProUpload`、`ProUploadList`、`ProPreviewFile`。
- [x] 统一文件状态、错误、预览、下载和自定义请求类型。
- [x] 补充受控文件列表与工具函数测试。

### 阶段 3：表单体系

- [x] 重建泛型 `ProForm<TModel>` 与 `ProFormField<TModel>`。
- [x] 修复 model 入参突变、旧字段残留、validate 传 Ref、空方法和折叠状态问题。
- [x] 实现 `dependencies`、`shouldUpdate`、动态显隐/禁用/属性/规则与路径读写。
- [x] 完善异步校验、字段转换和服务端错误回填。
- [x] 统一响应式栅格折叠、受控状态、submitter 插槽与 Ref 展开收起能力。
- [x] 折叠字段保持挂载，校验失败自动展开，提交事件使用转换后的安全副本。
- [x] 迁移 Modal/Drawer/Steps 容器并保持 ProForm 可独立使用。
- [x] 将 ProForm 的 `@register` 迁移为 `defineExpose()` + `useTemplateRef()`。

### 阶段 4：表格体系

- [x] 建立泛型 `ProTable<TRecord, TQuery, TResponse>` 独立核心并替换同名旧入口。
- [x] 请求函数和 loading 完全响应式；失败必定结束 loading。
- [x] 修复选择同步、编辑状态、VNode 渲染和列稳定 key。
- [x] 使用 `ResizeObserver` 实现自动高度。
- [x] 将 Search 与 Editable 作为显式扩展，核心表格不依赖 ProForm。

当前新核心已接入：远程/本地分页、最后请求生效、受控及跨页选择、稳定列 key 与独立 `dataIndex`、ProField 渲染、序号列、动态 valueType/valueEnum、列状态持久化、刷新/密度/列设置工具栏、行编辑与行拖拽。`ProEditableTable` 和 `ProDragSortTable` 仅作为核心能力的快捷预设，不维护独立状态引擎。示例区只展示新版组件。

详细功能并集与迁移状态见 [ProTable 功能对齐](./pro-table-feature-alignment.md)。

### 阶段 5：描述与 CRUD 集成

- [x] 完成泛型 `ProDescriptions<TRecord, TParams>`，复用 `ProField`，并保持 `key` 与 `dataIndex` 职责独立。
- [x] 支持详情请求、参数响应、加载/空/错误/重试状态，以及 `reload`、getter 和折叠命令。
- [x] 支持按组件宽度响应的 `column`/`span`、分组、受控折叠、复制、具名插槽和 `useProDescriptions`。
- [x] 为 `ProEditableTable` 增加数据与编辑 key getter、批量校验/保存/取消、取消新增行时移除草稿，以及 `onSave` 返回替换记录。
- [x] 拆分表单容器的初始数据加载与提交状态，增加 `beforeSubmit` 草稿提交保护，以及 `getLoadingData()` / `getSubmitting()` getter。
- [x] 建立订单 CRUD 页面、菜单路由、API 和 mock，表格列、搜索字段、表单字段、详情列和明细列保持独立 schema。
- [x] 完成页面层的服务端分页、跨页选择、创建、异步编辑、详情、单删/批量删除、字段错误回填和可编辑订单明细接线。
- [x] 修复受控 `data` 回写清空其他编辑草稿，以及分页配置对象重建导致页码复位的问题。
- [x] 将 ProTable 实例状态改为 getter/命令 API，并补齐 `getTotal()`、`getSelectedKeys()`、`setPageInfo()`。
- [x] 完成订单 CRUD 的浏览器交互、暗色主题和窄屏回归验收。

### 阶段 6：ProConfigProvider

- [x] 完成 `ProConfigProvider` 的局部覆盖、统一尺寸、主题/暗色模式、请求适配、字段注册和默认配置接入。
- [x] 验证嵌套 Provider 合并、局部覆盖、运行时更新和组件级显式配置优先级。

### 阶段 7：ProCard / ProStatisticCard

- [x] 实现可独立使用的 `ProCard`，覆盖分组、分割、折叠、加载和响应式布局。
- [x] 基于 `ProCard` 实现 `ProStatisticCard`，覆盖指标、趋势、图表区域和工作台组合布局。

### 阶段 8：ProList

- [x] 实现 `ProList`，复用请求、分页、选择和字段展示基础能力。
- [x] 提供项目运营真实业务列表示例，避免与 `ProTable` 重复封装。

### 阶段 9：验收与清理

- [x] 删除 `src/components` 下的 Pro 同名旧组件和旧 `@register` 调用。
- [x] 更新全部示例页，覆盖独立使用、组合使用、Ref 和泛型推导。
- [x] 清除跨组件的旧深层路径导入。
- [x] 完成组件级、类型级和关键交互测试。

### 阶段 10：反馈、树与工程闭环

- [x] 完成 `ProEmpty`、`ProResult`、`ProCheckCard`、`ProTree / ProTreeSelect` 和 `ProQueryFilter` 的公共 API、Hook、示例与文档。
- [x] 将 403/404/500、Preview、CRUD 和数据组件反馈态统一到 `ProResult / ProEmpty`。
- [x] 完成 ROUTE_MAPPING、ROLE、BACKED 三种权限模式菜单回归。
- [x] 完成 CheckCard、TreeSelect、Tree、Modal/Drawer dirty 和 ProTable URL E2E。
- [x] 完成 workspace 包脚本、主题包迁移、依赖边界审计、产物校验和工程验收。

## 8. 质量门槛

每一阶段至少执行：

```bash
pnpm run check
pnpm run test:types
pnpm run test:e2e
pnpm run build
pnpm exec vitest run
git diff --check
```

E2E 本地默认使用已安装的 Chrome。CI 首次执行前运行 `pnpm exec playwright install chromium`，也可以通过 `PLAYWRIGHT_CHANNEL` 指定其他已安装的浏览器通道。

组件验收还必须覆盖：浅色/暗色主题、空数据、加载、错误、禁用、只读、超长文本、键盘操作、异步竞态、受控值回写和卸载后的异步请求。

## 9. 当前验收重点

未开发能力、暂缓组件与推荐顺序见 [ProComponents 未开发与收尾清单](./pro-components-backlog.md)。

Layout 类问题独立记录在 [Layout 已知问题](./layout-known-issues.md)，不阻塞当前组件实施顺序。

P0（已完成）：订单 CRUD 浏览器全流程、暗色/窄屏、跨页选择和 mock 前缀回归。

P1（已完成）：ProEditableTable 多草稿稳定性、ProDescriptions 详情能力，以及 Modal/Drawer 加载、提交和服务端字段错误状态。

P2（已完成）：`ProConfigProvider`、`ProCard / ProStatisticCard` 与 `ProList` 已补齐组件、真实示例、类型测试和交互测试。

P3（已完成）：统一请求生命周期已支持 AbortSignal、debounce、retry、阶段状态与卸载取消；`ProTable` 已支持服务端排序/筛选和受控分页；`ProList`、`ProDescriptions`、`ProSelect` 已统一暴露请求阶段；`ProForm` 已支持异步初始化、dirty/submitting 状态和离开保护。

P4（已完成）：反馈组件、树组件、CheckCard、QueryFilter、ProSelect 缓存、ProTable URL 状态、三种权限模式与 20 条浏览器 E2E 已闭环；剩余事项仅保留在明确标注的暂缓清单中。
