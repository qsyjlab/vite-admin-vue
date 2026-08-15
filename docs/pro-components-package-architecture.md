# ProComponents 多包架构

## 包职责

```text
packages/
  element-plus-theme/    # Element Plus 亮色、暗色令牌与通用组件美化
  pro-components/       # 表单、表格、字段、选择、上传、详情、卡片、列表、空状态
  pro-code-editor/       # ProCodeEditor 与 ProJsonEditor
src/components/
  pro-tabs/              # 后台布局标签页，不属于通用 ProComponents
```

应用统一从包名导入：

```ts
import { ProForm, ProTable } from '@framebase/element-plus-pro-components'
import { ProCodeEditor, ProJsonEditor } from '@framebase/vue-code-editor'
import '@framebase/element-plus-theme/style.css'
```

`src/pro-components` 已删除，不保留兼容转发入口。

## 依赖边界

- `pro-components` 不允许导入 `@/`、业务路由、Store、Mock 或应用组件。
- `element-plus-theme` 不允许依赖应用 `--global-*`、Layout 变量或导航选择器。
- Vue、Element Plus、lodash-es、sortablejs 和 vue-router 作为 peer dependency。
- 文件预览器通过 `registerProPreviewFileRenderer()` 注入 PDF、XLSX、DOCX 渲染器。
- `ProTabs` 使用布局状态和应用图标组件，因此留在后台应用。
- 编辑器独立成包，避免普通表单、表格用户承担编辑器体积。
- 主题包只发布 CSS，应用导航和 Layout 样式继续由应用维护。

## 后续迁移规则

- 新增通用 Pro 组件直接进入 `packages/pro-components/src`。
- 新增通用 Element Plus 视觉规则进入 `packages/element-plus-theme/src`。
- 编辑器语言支持、主题和解析能力进入 `packages/pro-code-editor/src`。
- 包内只能使用相对路径引用其他内部模块，禁止通过包根形成循环导入。
- 示例、路由、Mock 和业务 API 留在应用的 `src` 目录。
