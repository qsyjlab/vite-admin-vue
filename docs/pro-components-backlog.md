# ProComponents 未开发与收尾清单

## 当前基线

- `@vite-admin/pro-components` 已包含 Field、Form、Table、Select、Upload、Descriptions、Card、List、Empty 等核心组件。
- `@vite-admin/pro-code-editor` 已包含可用的轻量 `ProCodeEditor` 和 `ProJsonEditor`。
- `src/pro-components` 已删除，应用统一使用 workspace 包。
- 当前应用类型测试、112 条应用单元测试以及 106 条包级单元测试通过。
- 两个 workspace 包已具备独立构建、类型、测试、Lint、产物检查和打包脚本。

## 刚实现，尚未完成验收

以下能力已有代码并通过 TypeScript，但在补齐示例、测试和文档前不视为最终完成：

- `ProResult`：已实现状态、插槽和操作事件；待示例、单测、暗黑/窄屏验收。
- `ProCheckCard / ProCheckCardGroup`：已实现单选、多选、禁用、加载和响应式布局；待泛型测试、键盘交互和示例。
- `ProTree / ProTreeSelect`：已实现字段映射、搜索、选中、懒加载入口和 Ref API；待异步父节点补全、路径回显、测试和示例。
- `ProQueryFilter`：已实现独立使用、条件计数、清空和 ProForm/ProTableSearch 桥接；待查询历史、完整 Ref 类型和示例。
- `ProSelect` 请求缓存：已实现 TTL、请求去重、失效和强制刷新；待运行新增单测并验证远程搜索边界。
- `ProTable` 状态持久化：已实现 session/local storage 的分页、排序、筛选恢复；待 URL 同步、恢复时重复请求审计和测试。
- Modal/Drawer dirty 保护：已接入统一 `close()` 并增加单元测试；待遮罩、ESC、取消按钮和路由场景 E2E。

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
- [ ] 验证取消、遮罩关闭、ESC 和路由离开场景。
- [ ] 补充关闭保护单元测试和 E2E。

### 4. 浏览器验收

- [ ] 运行新增 ProTable 服务端排序 E2E。
- [ ] 运行 ProForm 异步初始化和 dirty E2E。
- [ ] 增加 ProEmpty 四种状态 E2E。
- [ ] 增加 CodeEditor/JsonEditor 输入、格式化、校验 E2E。
- [ ] 覆盖暗黑模式、窄屏、键盘操作和只读/禁用状态。

阻塞：Playwright 本地服务启动审批当前返回 503。

## P1：核心能力收尾

### 5. 请求状态一致性

- [ ] 统一 Table、List、Descriptions、Select 的错误展示和重试入口。
- [ ] 统一 `request-state-change`、`request-error` 和 Ref 生命周期返回值。
- [ ] 为 ProForm 暴露与其他数据组件一致的请求生命周期对象。
- [ ] 明确取消请求不触发业务错误，重试保留原参数。

### 6. ProTable 查询状态

- [ ] 分页、排序、筛选和搜索条件支持可选 URL 同步。
- [x] 支持可选 session/local 持久化与恢复。
- [ ] 恢复状态时避免重复请求和页码抖动。
- [ ] 增加服务端筛选示例与浏览器测试。

### 7. ProSelect 请求缓存

- [x] 相同参数结果缓存和请求去重。
- [x] 配置缓存时间、手动失效和强制刷新。
- [ ] 处理远程搜索、分页选项和外部 `remoteMethod` 的缓存边界。

### 8. ProEmpty 接入收尾

- [x] 接入 ProList、ProDescriptions、ProUploadList。
- [ ] 统一 ProTable 空状态和搜索无结果状态。
- [ ] 评估 Preview、CRUD 页面和错误页是否复用。
- [ ] 补齐 Props、Events、Slots 和设计规范文档。

## P2：新增组件候选

只有出现明确业务使用场景后再开发，避免简单包装 Element Plus。

### 9. ProQueryFilter

- [x] 独立于 ProTable 使用。
- [x] 响应式折叠、已启用条件计数和快捷清空。
- [ ] 查询历史与常用条件保存。
- [x] 可与 ProForm schema、ProTable params 显式桥接。

### 10. ProTree / ProTreeSelect

- [x] 泛型节点和字段映射。
- [x] 懒加载、搜索、受控选中和 Ref API。
- [ ] 远程整树请求、错误态和重试。
- [ ] TreeSelect 支持路径回显和异步父节点补全。

### 11. ProCheckCard / ProCheckCardGroup

- [x] 卡片式单选、多选、禁用和加载状态。
- [x] 泛型值、受控 model、响应式网格和自定义内容插槽。
- [ ] 键盘选择、焦点样式和表单校验集成。

### 12. ProResult

- [x] success、error、warning、info、403、404、500 状态。
- [x] 图标、标题、描述、内容、操作区和事件。
- [ ] 与错误页、CRUD 成功页和请求错误态建立示例。
- [ ] 补齐暗黑模式、窄屏和无障碍验收。

## 暂缓开发

- `ProPageContainer`：与当前后台 Layout 和 PageWrapper 重叠，优先级低。
- `ProTransfer`：暂无明确业务缺口。
- `ProSegmented`：现有组件足够，暂无 Pro 化收益。
- `ProListForm`：表格和现有动态表单能够覆盖主要场景。
- 独立仓库发布和 npm 正式发布流程：当前先维持同仓库 workspace 多包。

## 工程收尾

- [ ] 审批服务恢复后执行 `pnpm install`，同步 workspace lockfile。
- [x] 为两个 package 建立独立 build、lint、typecheck、test 和 pack 脚本。
- [x] 补齐 package README、公共导出和 peer dependency 说明。
- [x] 建立依赖边界审计，禁止应用别名、业务模块和未声明外部依赖。
- [x] 建立产物检查，验证 ESM、类型、样式、子路径导出和 tarball 内容。
- [x] 完成应用与包级 typecheck、unit、build、ESLint 和 diff check。
- [ ] 完成浏览器 E2E（本地服务启动审批 503 阻塞）。

## 推荐执行顺序

1. 审批和网络恢复后同步 workspace lockfile。
2. 完成 E2E、暗黑模式、窄屏和键盘验收。
3. 统一请求错误态并补齐 ProTable URL 状态同步。
4. 根据实际业务需要再增强编辑器内核。
