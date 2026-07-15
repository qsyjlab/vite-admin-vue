# ProComponents 未开发与收尾清单

## 当前基线

- `@framebase/element-plus-pro-components` 已包含 Field、Form、Table、Select、Upload、Descriptions、Card、List、Empty 等核心组件。
- `@framebase/vue-code-editor` 已包含可用的轻量 `ProCodeEditor` 和 `ProJsonEditor`。
- `@framebase/element-plus-theme` 已承载通用 Element Plus 令牌、暗黑模式和组件美化样式。
- `src/pro-components` 已删除，应用统一使用 workspace 包。
- 当前应用类型测试、137 条仓库单元测试、123 条核心组件包单元测试以及 20 条浏览器 E2E 均已通过。
- 三个 workspace 包已具备独立构建、检查、测试、产物验证和打包脚本。

## 已完成闭环

- `ProResult`：已实现状态、插槽、操作事件、默认内容单测，并接入 403/404/500 页面与浏览器回归。
- `ProCheckCard / ProCheckCardGroup`：已实现单选、多选、禁用、加载、响应式布局、键盘导航、表单校验联动和套餐配置示例，并完成暗黑窄屏 E2E。
- `ProTree / ProTreeSelect`：已实现字段映射、搜索、选中、懒加载、整树请求、错误保留/重试、异步路径回显、Ref/Hook API、工具测试、组织树示例和 E2E。
- `ProQueryFilter`：已实现独立使用、条件计数、清空、完整 Ref/Hook、ProForm/ProTableSearch 桥接和订单查询示例；查询历史按实际需求后续增强。
- `ProSelect` 请求缓存：已实现 TTL、请求去重、参数隔离、命名空间失效、强制刷新和缓存边界测试；外部 `remoteMethod` 不进入内部缓存。
- `ProTable` 状态持久化：已实现 session/local storage 和 URL 的分页、排序、筛选恢复，首次请求不再重置恢复状态，并补齐 URL/请求单测和浏览器测试。
- `ProEmpty`：已接入 Table、List、Descriptions、UploadList、Preview 和 CRUD 查询状态；请求错误与无数据边界统一。
- Modal/Drawer dirty 保护：已接入统一 `close()`，覆盖拒绝/确认、提交强制关闭、提交中阻止关闭、遮罩与 ESC 浏览器场景。
- 权限与主题回归：ROUTE_MAPPING、ROLE、BACKED 三种权限模式，以及暗黑、窄屏和键盘交互均进入 Playwright 回归。

## 暂缓：编辑器增强

### 1. ProCodeEditor 正式编辑器内核

当前轻量 textarea 版本用于稳定公开 API，尚未接入 CodeMirror 6。

- [ ] 接入 CodeMirror 6，保持现有 Props、Events 和 Ref API 不变。
- [ ] 支持按需语言扩展和语法高亮。
- [ ] 支持搜索、替换、撤销、重做和快捷键。
- [ ] 支持诊断标记、错误位置跳转和当前行高亮。
- [ ] 支持受控主题、暗黑模式、只读和禁用状态。
- [ ] 避免 SSR、首次加载和大文本场景阻塞页面。

当前普通文本编辑、受控值、只读/禁用和 Ref API 已可用。现阶段不引入 CodeMirror，避免编辑器增强阻塞工程收尾。

### 2. ProJsonEditor 完整能力

- [ ] 接入 CodeMirror JSON language 与 lint diagnostics。
- [ ] 支持可选 JSON Schema 校验。
- [ ] 点击错误信息跳转到对应行列。
- [ ] 验证对象模式、字符串模式和外部受控值回写。
- [ ] 增加大 JSON、非法 JSON 和空值测试。

### 3. 表单容器脏数据闭环

`ProForm` 已有 dirty 状态和路由离开保护，但 Modal/Drawer 尚未自动组合。

- [x] `ProModalForm`、`ProDrawerForm` 内置可选未保存修改确认。
- [x] 提交成功强制关闭，普通 `close()` 统一执行 dirty 判断。
- [x] 提交失败保留表单数据和字段错误。
- [x] 异步初始化完成后重置 clean baseline。
- [x] 验证取消、遮罩关闭、ESC 和路由离开场景。
- [x] 补充关闭保护单元测试和 E2E。

### 4. 浏览器验收

- [x] 运行 ProTable 服务端排序与 URL 状态 E2E。
- [x] 运行 ProForm 异步初始化和 dirty E2E。
- [x] 验证 ProEmpty 在表格、树、列表、预览与 CRUD 场景的接入。
- [ ] 增加 CodeEditor/JsonEditor 输入、格式化、校验 E2E。
- [x] 覆盖核心组件的暗黑模式、窄屏、键盘操作和禁用状态。

## P1：核心能力收尾

### 5. 请求状态一致性

- [x] 统一 Table、List、Descriptions、Select 的错误展示和重试入口。
- [x] 统一 `request-state-change`、`request-error` 和 Ref 生命周期返回值。
- [x] 为 ProForm 暴露与其他数据组件一致的请求生命周期对象。
- [x] 明确取消请求不触发业务错误，重试保留原参数。

### 6. ProTable 查询状态

- [x] 分页、排序、筛选支持可选 URL 同步；搜索条件由业务 `params` 或路由层显式管理。
- [x] 支持可选 session/local 持久化与恢复。
- [x] 恢复状态时避免重复请求和页码抖动。
- [x] 增加分页、排序和 URL 状态浏览器测试；服务端筛选继续由组件单测覆盖。

### 7. ProSelect 请求缓存

- [x] 相同参数结果缓存和请求去重。
- [x] 配置缓存时间、手动失效和强制刷新。
- [x] 处理远程搜索、分页选项和外部 `remoteMethod` 的缓存边界。

### 8. ProEmpty 接入收尾

- [x] 接入 ProList、ProDescriptions、ProUploadList。
- [x] 统一 ProTable 空状态、搜索无结果、请求错误和保留旧数据状态。
- [x] 接入 Preview、CRUD 页面和错误页。
- [x] 补齐 Props、Events、Slots 和设计规范文档。

## P2：新增组件候选

只有出现明确业务使用场景后再开发，避免简单包装 Element Plus。

### 9. ProQueryFilter

- [x] 独立于 ProTable 使用。
- [x] 响应式折叠、已启用条件计数和快捷清空。
- [ ] 查询历史与常用条件保存。
- [x] 可与 ProForm schema、ProTable params 显式桥接。
- [x] 完整 Ref/Hook 类型和独立业务示例。

### 10. ProTree / ProTreeSelect

- [x] 泛型节点和字段映射。
- [x] 懒加载、搜索、受控选中和 Ref API。
- [x] 远程整树请求、错误态和重试。
- [x] TreeSelect 支持路径回显和异步父节点补全。
- [x] 静态字段映射和异步组织路径示例。

### 11. ProCheckCard / ProCheckCardGroup

- [x] 卡片式单选、多选、禁用和加载状态。
- [x] 泛型值、受控 model、响应式网格和自定义内容插槽。
- [x] 键盘选择、焦点样式和表单校验集成。
- [x] 单选套餐和多选业务模块示例。

### 12. ProResult

- [x] success、error、warning、info、403、404、500 状态。
- [x] 图标、标题、描述、内容、操作区和事件。
- [x] 建立发布成功、权限不足和服务异常示例。
- [x] 补齐 CSS 变量主题、页面填充、`aria-live` 和浏览器验收。

## 暂缓开发

- `ProPageContainer`：与当前后台 Layout 和 PageWrapper 重叠，优先级低。
- `ProTransfer`：暂无明确业务缺口。
- `ProSegmented`：现有组件足够，暂无 Pro 化收益。
- `ProListForm`：表格和现有动态表单能够覆盖主要场景。
- 独立仓库发布和 npm 正式发布流程：当前先维持同仓库 workspace 多包。

## 工程收尾

- [x] 同步 workspace lockfile，记录三个本地包链接和工程脚本运行依赖。
- [x] 为三个 package 建立独立 build、lint、typecheck、test 和 pack 脚本。
- [x] 补齐 package README、公共导出和 peer dependency 说明。
- [x] 建立依赖边界审计，禁止应用别名、业务模块和未声明外部依赖。
- [x] 建立产物检查，验证 ESM、类型、样式、子路径导出和 tarball 内容。
- [x] 完成应用与包级 typecheck、unit、build、ESLint 和 diff check。
- [x] 完成 20 条浏览器 E2E，覆盖权限模式、CRUD、CheckCard、TreeSelect、Tree、dirty、ProTable URL、反馈页、暗黑和窄屏。

## 推荐执行顺序

1. 保持 `pnpm run check`、包边界审计和 20 条 E2E 作为合并门槛。
2. 根据实际业务需要再增强编辑器内核或 QueryFilter 查询历史。
3. 出现明确业务缺口后，再评估暂缓组件。
