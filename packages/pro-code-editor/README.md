# @framebase/vue-code-editor

轻量的 Vue 代码与 JSON 编辑组件包，与主 ProComponents 包分离，避免普通页面承担编辑器体积。

## 使用

```ts
import { ProCodeEditor, ProJsonEditor } from '@framebase/vue-code-editor'
import '@framebase/vue-code-editor/style.css'
```

当前实现支持双向绑定、行号、Tab 缩进、只读、禁用、暗黑模式，以及 JSON 校验、格式化和压缩。CodeMirror 增强不属于当前工程收尾范围。

## 命令

- `pnpm build`：生成 ESM、类型声明和样式产物。
- `pnpm typecheck`：检查包内类型。
- `pnpm test`：运行包内单元测试。
- `pnpm lint`：检查包内源码。
