# ProComponents 未开发与收尾清单

## 当前基线

- `@vite-admin/pro-components` 已包含 Field、Form、Table、Select、Upload、Descriptions、Card、List、Empty 等核心组件。
- `@vite-admin/pro-code-editor` 已包含可用的轻量 `ProCodeEditor` 和 `ProJsonEditor`。
- `src/pro-components` 已删除，应用统一使用 workspace 包。
- 当前类型检查、生产构建以及 110 条单元测试通过。

## P0：必须完成

### 1. ProCodeEditor 正式编辑器内核

当前轻量 textarea 版本用于稳定公开 API，尚未接入 CodeMirror 6。

- [ ] 接入 CodeMirror 6，保持现有 Props、Events 和 Ref API 不变。
- [ ] 支持按需语言扩展和语法高亮。
- [ ] 支持搜索、替换、撤销、重做和快捷键。
- [ ] 支持诊断标记、错误位置跳转和当前行高亮。
- [ ] 支持受控主题、暗黑模式、只读和禁用状态。
- [ ] 避免 SSR、首次加载和大文本场景阻塞页面。

阻塞：CodeMirror 依赖安装目前被本机审批服务 503 拦截。

### 2. ProJsonEditor 完整能力

- [ ] 接入 CodeMirror JSON language 与 lint diagnostics。
- [ ] 支持可选 JSON Schema 校验。
- [ ] 点击错误信息跳转到对应行列。
- [ ] 验证对象模式、字符串模式和外部受控值回写。
- [ ] 增加大 JSON、非法 JSON 和空值测试。

### 3. 表单容器脏数据闭环

`ProForm` 已有 dirty 状态和路由离开保护，但 Modal/Drawer 尚未自动组合。

- [ ] `ProModalForm`、`ProDrawerForm` 内置可选未保存修改确认。
- [ ] 区分取消、遮罩关闭、ESC、路由离开和提交成功关闭。
- [ ] 提交失败保留表单数据和字段错误。
- [ ] 异步初始化完成后重置 clean baseline。
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
- [ ] 支持可选 session/local 持久化与恢复。
- [ ] 恢复状态时避免重复请求和页码抖动。
- [ ] 增加服务端筛选示例与浏览器测试。

### 7. ProSelect 请求缓存

- [ ] 相同参数结果缓存和请求去重。
- [ ] 配置缓存时间、手动失效和强制刷新。
- [ ] 处理远程搜索、分页选项和外部 `remoteMethod` 的缓存边界。

### 8. ProEmpty 接入收尾

- [x] 接入 ProList、ProDescriptions、ProUploadList。
- [ ] 统一 ProTable 空状态和搜索无结果状态。
- [ ] 评估 Preview、CRUD 页面和错误页是否复用。
- [ ] 补齐 Props、Events、Slots 和设计规范文档。

## P2：新增组件候选

只有出现明确业务使用场景后再开发，避免简单包装 Element Plus。

### 9. ProQueryFilter

- [ ] 独立于 ProTable 使用。
- [ ] 响应式折叠、已启用条件计数、快捷清空和查询历史。
- [ ] 可与 ProForm schema、ProTable params 显式桥接。

### 10. ProTree / ProTreeSelect

- [ ] 泛型节点和字段映射。
- [ ] 远程加载、懒加载、搜索、受控选中和 Ref API。
- [ ] TreeSelect 支持路径回显和异步父节点补全。

### 11. ProCheckCard / ProCheckCardGroup

- [ ] 卡片式单选、多选、禁用和加载状态。
- [ ] 泛型值、受控 model、响应式网格和自定义内容插槽。

## 暂缓开发

- `ProPageContainer`：与当前后台 Layout 和 PageWrapper 重叠，优先级低。
- `ProTransfer`：暂无明确业务缺口。
- `ProSegmented`：现有组件足够，暂无 Pro 化收益。
- `ProListForm`：表格和现有动态表单能够覆盖主要场景。
- `ProResult`：先由 ProEmpty 和现有错误页覆盖，暂不新增平行状态组件。
- 独立仓库发布、npm 打包和版本发布流程：先完成同仓库多包逻辑与验收。

## 工程收尾

- [ ] 审批服务恢复后执行 `pnpm install`，同步 workspace lockfile。
- [ ] 为两个 package 建立独立 lint、typecheck 和 test 脚本。
- [ ] 补齐 package README、公共导出表和 peer dependency 说明。
- [ ] 检查所有包内是否存在应用别名、业务类型或隐式全局组件依赖。
- [ ] 建立 API 变更检查，防止示例与公共类型漂移。
- [ ] 最终执行 typecheck、unit、E2E、build、ESLint 和 diff check。

## 推荐执行顺序

1. CodeMirror 依赖恢复后完成 ProCodeEditor / ProJsonEditor。
2. 完成 Modal/Drawer dirty 关闭保护。
3. 统一请求错误态和 ProTable 查询状态。
4. 完成 E2E、暗黑模式、窄屏和键盘验收。
5. 根据实际业务需求选择 ProQueryFilter 或 ProTree 系列。
