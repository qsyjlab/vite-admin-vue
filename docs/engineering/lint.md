# 代码规范

## ESLint

- ESLint 9（flat config），配合 `eslint-config-prettier`、`eslint-plugin-vue`、`typescript-eslint`。
- 配置文件：`eslint.config.mjs`。
- 命令：`pnpm lint`（`eslint . --fix`）。

## Prettier

- 配置文件：`.prettierrc.mjs`（无分号、单引号、行宽 100、缩进 2）。
- `lint-staged` 配置在 `lint-staged.config.mjs`。
- 命令：`pnpm prettier`（`prettier --write .`）。

`lint-staged.config.mjs` 对 `*.{vue,js,ts,jsx,tsx,mjs,cjs}` 依次执行 `prettier --write` 与 `eslint --fix`，对 `*.{md,json}` 执行 `prettier --write`。

## Husky

- `.husky/pre-commit`：执行 `lint-staged`。
- `.husky/commit-msg`：执行 `commitlint` 校验提交信息。

## commitlint

- 配置：`commitlint.config.cjs`，继承 `@commitlint/config-conventional`。
- header 最大长度 108，body / footer 前需空行。

### commit 规范（Conventional Commits）

| type       | 说明                           |
| ---------- | ------------------------------ |
| `feat`     | 新功能                         |
| `fix`      | 修复 bug                       |
| `perf`     | 性能 / 体验优化                |
| `style`    | 格式（不影响代码运行）         |
| `refactor` | 重构（非新增功能，非修复 bug） |
| `docs`     | 文档                           |
| `test`     | 测试                           |
| `build`    | 构建系统 / 依赖                |
| `ci`       | CI 配置                        |
| `chore`    | 构建 / 辅助工具变动            |
| `revert`   | 回滚                           |

示例：`feat(order): 新增订单导出`。

## VSCode 推荐

见 `.vscode/extensions.json` 与 `.vscode/settings.json`：

- 保存时自动格式化（Prettier）与 ESLint 修复。
- 推荐插件：Volar、ESLint、Prettier、UnoCSS、EditorConfig、DotENV、Error Lens。
