# Changesets

每个可发布包的用户可见变更都需要新增一个 changeset：

```bash
pnpm changeset
```

选择受影响的 `@framebase/*` 包和 semver 级别后提交生成的 Markdown 文件。合并发布准备分支前执行：

```bash
pnpm release:status
pnpm release:version
```

`release:publish` 只应在已配置 npm 组织权限、双因素认证和 `NPM_TOKEN` 的发布环境中手动执行。
