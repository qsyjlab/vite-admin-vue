# ProComponents 发布准备

当前仓库仍是应用与三包共存的 workspace。三个包已经具备公开包元数据，但不会因为安装或 CI 自动发布：

- `@framebase/element-plus-pro-components`
- `@framebase/vue-code-editor`
- `@framebase/element-plus-theme`

## 发布前检查

1. 确认 npm `@framebase` 组织、包名和维护者权限。
2. 为发布账号启用双因素认证，创建只允许发布的 `NPM_TOKEN`。
3. 创建 changeset：

   ```bash
   pnpm changeset
   pnpm release:status
   ```

4. 生成版本并更新 lockfile：

   ```bash
   pnpm release:version
   ```

5. 使用 tarball 验证真实消费者，而不是只验证 workspace alias：

   ```bash
   pnpm verify:release
   ```

6. 登录 npm 后，先在本地执行 dry-run：

   ```bash
   pnpm --filter @framebase/element-plus-pro-components publish --dry-run --access public
   pnpm --filter @framebase/vue-code-editor publish --dry-run --access public
   pnpm --filter @framebase/element-plus-theme publish --dry-run --access public
   ```

正式发布默认由维护者在本地手动执行，不依赖 GitHub Actions：

```bash
npm login --scope=@framebase
pnpm release:publish
```

GitHub Actions 只作为可选的远程验收或备用发布入口，不是发布前置条件。

## 版本策略

- `pro-components` 的组件 API、类型或行为变化按 semver 管理。
- `element-plus-theme` 的 token、选择器和 CSS 导出变化按 semver 管理。
- `vue-code-editor` 保持与主包独立版本，编辑器内核增强不阻塞主包发布。
- 三包没有运行时内部依赖，因此不强制固定版本；只有确实需要联动时才在 changeset 中同时选择多个包。

## 独立仓库迁移

完整阶段、tooling 职责和后台应用切换流程见 [ProComponents 独立仓库迁移计划](./pro-components-repository-migration-plan.md)。

推荐建立一个 `framebase-element-plus` 仓库，继续使用 pnpm workspace 管理三包，而不是为每个包建立独立仓库。迁移顺序：

1. 复制 `packages/pro-components`、`packages/pro-code-editor`、`packages/element-plus-theme` 及各自 README。
2. 复制 `.changeset`、`tests/package-consumer`、`build/scripts/verify-package-consumer.ts`、三包 CI/release workflow 和 MIT `LICENSE`。
3. 新仓库重新建立最小根 `package.json`、`pnpm-workspace.yaml`、`tsconfig`、ESLint、Vitest 和 Vite 配置；不要复制应用的 `src`、Mock、路由或 `@/` 别名。
4. 复制 `packages/tsconfig.base.json`；两个组件包已不再继承应用根 `tsconfig.app.json`，类型测试继续保留在 `packages/pro-components/src/__type-tests__`。
5. 保持包名、导出路径、peerDependencies 和 CSS 子路径不变，先用 tarball 消费者验证，再切换 repository/homepage URL。
6. 使用 `git filter-repo` 或保留新仓库初始提交，不直接把应用历史和业务代码带入包仓库。
7. 新仓库首个发布前，更新三个 package 的 `repository.directory`、`homepage`、Changesets `baseBranch` 和 CI 触发分支。

## 迁移验收

- [ ] 新仓库可独立 `pnpm install --frozen-lockfile`。
- [ ] 三包可独立 typecheck、lint、unit、build 和 pack。
- [ ] tarball 消费者可通过 `vue-tsc` 和 Vite build。
- [ ] 包内无应用别名、业务 API、路由、Mock 或 Layout 依赖。
- [ ] npm dry-run 内容只包含 `dist`、README、许可证和声明文件。
- [ ] npm 组织权限、token、provenance 和回滚策略已由维护者确认。
