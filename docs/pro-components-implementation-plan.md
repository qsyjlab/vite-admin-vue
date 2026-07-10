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

```text
src/components/pro-components/
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
  pro-preview-file/
```

旧目录在一个兼容周期内只做重新导出，并标记 `@deprecated`。目录迁移和行为重构分开审查，避免 import 变化掩盖功能回归。

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
- 组件公开类型不得包含实现拼写错误；旧错误字段仅保留 deprecated 兼容。

## 5. Ref 与 Hooks 契约

每个有命令式行为的组件定义 `ProXxxExpose`：

- 组件内使用 `defineExpose()`。
- 父组件使用 `useTemplateRef<ProXxxInstance>()` 获取实例。
- `useProXxx(ref)` 接收模板 ref，并代理常用方法。
- Hook 不创建隐藏注册通道，不依赖组件触发 `@register`。
- 旧 `register` 在兼容周期保留，迁移完成后删除。

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

## 7. 分阶段实施

### 阶段 0：契约与基线

- [x] 建立本实施计划。
- [x] 确认命名、独立性、泛型、Ref 和兼容策略。
- [ ] 为已知 P0 缺陷建立最小回归测试基线。

验收：文档中的类型和目录约束可以直接用于代码审查。

### 阶段 1：基础层与选择类组件

- [x] 建立 `pro-components` 根入口。
- [x] 实现限深数据路径与运行时取值工具。
- [x] 实现具备最新请求获胜语义的请求状态 Hook。
- [x] 重构泛型 `ProSelect`，保留旧入口兼容。
- [ ] 迁移 `ProRadioGroup` 与 `ProCheckboxGroup`。
- [ ] 建立 `ProField` valueType 注册与只读/编辑渲染。

验收：组件可单独导入；远程请求无竞态覆盖；外部 `remoteMethod` 生效；切换 `multiple` 不修改 model；类型检查通过。

### 阶段 2：上传组件

- [ ] 迁移 `ProUpload`、`ProUploadList`、`ProPreviewFile`。
- [ ] 统一文件状态、错误、预览、下载和自定义请求类型。
- [ ] 补充受控/非受控列表行为测试。

### 阶段 3：表单体系

- [ ] 重建泛型 `ProForm<TModel>` 与 `ProFormField<TModel>`。
- [ ] 修复 model 入参突变、旧字段残留、validate 传 Ref、空方法和折叠状态问题。
- [ ] 实现字段依赖、异步校验、路径读写和布局能力。
- [ ] 迁移 Modal/Drawer/Steps 容器并保持 ProForm 可独立使用。
- [ ] 将 `@register` 迁移为 `defineExpose()` + `useTemplateRef()`。

### 阶段 4：表格体系

- [ ] 重建泛型 `ProTable<TRecord, TQuery, TResponse>`。
- [ ] 请求函数和 loading 完全响应式；失败必定结束 loading。
- [ ] 修复选择同步、编辑状态、VNode 渲染和列稳定 key。
- [ ] 使用 `ResizeObserver` 实现自动高度。
- [ ] 将 Search 与 Editable 作为显式扩展，核心表格不依赖 ProForm。

### 阶段 5：描述与配置层

- [ ] 迁移 `ProDescriptions` 并复用 ProField。
- [ ] 完成 `ProConfigProvider` 的局部覆盖、请求适配与字段注册。
- [ ] 清除跨组件的旧深层路径导入。

### 阶段 6：迁移与清理

- [ ] 更新示例页，覆盖独立使用、组合使用、Ref 和泛型推导。
- [ ] 发布 deprecated 迁移说明。
- [ ] 一个兼容周期后删除旧目录和 `@register`。
- [ ] 完成组件级、类型级和关键交互测试。

## 8. 质量门槛

每一阶段至少执行：

```bash
pnpm run check
pnpm run build
pnpm exec vitest run
git diff --check
```

组件验收还必须覆盖：浅色/暗色主题、空数据、加载、错误、禁用、只读、超长文本、键盘操作、异步竞态、受控值回写和卸载后的异步请求。

## 9. 当前优先缺陷

P0：请求失败后 loading 不结束、表单 model 被修改、校验 API 不工作、远程选项竞态覆盖、选择状态内外不同步。

P1：自动高度无尺寸观察、动态 request 不响应、分组选项映射不完整、editable getter 逻辑错误、VNode 二次包装。

P2：旧 API 拼写错误、深层 `any` 扩散、目录和组件命名不统一、缺少示例与组件测试。
