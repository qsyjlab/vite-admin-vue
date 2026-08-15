# ProComponents 独立仓库迁移计划

## 1. 已确认的方向

- 采用整体组件库模式，不采用 shadcn 式源码复制模式。
- 建立一个独立 Git 仓库，暂定仓库名 `framebase-element-plus`。
- 仓库内继续使用 pnpm workspace 管理三个公开包，不拆成一个组件一个 npm 包。
- npm 发布以维护者本地手动发布为主，GitHub Actions 只作为可选验收工具。
- 保持现有包名、根入口、组件子路径和 CSS 导出兼容。

迁移的公开包：

1. `@framebase/element-plus-pro-components`
2. `@framebase/element-plus-theme`
3. `@framebase/vue-code-editor`

## 2. 迁移范围

### 2.1 必须迁移

- `packages/pro-components`
- `packages/element-plus-theme`
- `packages/pro-code-editor`
- `packages/tsconfig.base.json`
- 三个包的 README、类型测试、单元测试和构建配置
- `.changeset`
- `tests/package-consumer`
- 包边界、产物和消费者验收脚本
- 组件库文档与独立示例
- 根 `LICENSE`

### 2.2 暂时留在后台应用仓库

- `src/layouts`、路由、菜单、Store、登录、权限和 Mock
- `PageWrapper`、`PageCard`、`ProTabs` 等 Layout 相关组件
- `ProIcon`、`ProEcharts`、Authority 和后台页面工具
- PDF、Excel、DOCX 的具体应用渲染器；组件包只保留 renderer 注册协议
- `macro-apps/react-swc`
- 路由、权限、Layout 和后台工程使用文档
- 业务 CRUD 示例；新仓库只保留用于验证组件 API 的中性示例

## 3. 目标目录

```text
framebase-element-plus/
  packages/
    pro-components/
    element-plus-theme/
    pro-code-editor/

  playgrounds/
    docs/
    basic/
    consumer/

  tooling/
    scripts/
    eslint/
    tsconfig/
    testing/

  tests/
    e2e/

  .changeset/
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  LICENSE
  README.md
```

`packages` 只放会被构建或发布的包。`playgrounds` 放开发和演示应用。`tooling` 放仓库维护工具，不能被组件运行时代码引用。

## 4. tooling 是什么

`tooling` 不是组件包，也不会发布给业务用户。它是独立仓库自己的工程基础设施。

| 目录或脚本                                    | 用途                                                     | 主要使用者             | 业务用户是否需要 |
| --------------------------------------------- | -------------------------------------------------------- | ---------------------- | ---------------- |
| `tooling/scripts/audit-package-boundaries.ts` | 检查包内是否错误引用应用别名、业务 API 或未声明依赖      | 组件维护者             | 否               |
| `tooling/scripts/verify-package-artifacts.ts` | 检查构建产物、类型声明、exports 和 CSS 是否存在          | 发布维护者             | 否               |
| `tooling/scripts/verify-package-consumer.ts`  | 用 `.tgz` 安装到临时项目，验证真实用户能否类型检查和构建 | 发布维护者、测试人员   | 否               |
| `tooling/tsconfig`                            | 提供包开发、类型声明构建和 Node 脚本的共享 TS 配置       | 所有组件开发者         | 否               |
| `tooling/eslint`                              | 统一 Vue、TypeScript、测试和脚本代码规范                 | 所有贡献者             | 否               |
| `tooling/testing`                             | 统一 Vitest、Playwright 和测试环境配置                   | 组件开发者、测试人员   | 否               |
| 包内 `vite.config.ts`                         | 将单个包构建成 ESM、类型和 CSS 产物                      | 包维护者               | 否               |
| `.changeset`                                  | 记录用户可见变更和版本级别                               | 组件贡献者、发布维护者 | 否               |

普通组件开发者通常只执行根命令：

```bash
pnpm check
pnpm test
pnpm build
```

根脚本会间接调用 `tooling`。业务项目安装组件后不会携带这些工具，也不会承担这些依赖。

暂时不要把 tooling 再发布成 `@framebase/build-tools`。只有未来出现第二个组件仓库，并且确实需要复用同一套构建基础设施时，再考虑抽成私有工具包。

## 5. 迁移前必须收口的扩展契约

迁移仓库前先完成以下内部调整，避免迁移后立即大规模改 API：

- 明确组件 Props、Slots、Provider、App 插件和内置默认值的覆盖优先级。
- 将 Field 和 Preview 注册器从模块级全局状态调整为可隔离、可恢复的作用域。
- 消除 `ProConfigProvider` 对 Table、List、Descriptions 等上层组件的反向类型依赖。
- 补齐 ProTable slots 和 ProForm attrs/events 的泛型类型。
- 明确 `shared` 中哪些是公开 API，哪些应迁入 `_internal`。
- 将 `pro-form/src` 扁平化为 components、hooks、types，统一 Form 与 Table 的目录约定。

以上工作不改变三个公开包的数量。

## 6. 实施阶段

### 阶段 0：冻结迁移基线

- 记录三个包的当前版本、exports、peerDependencies 和 tarball 内容。
- 运行 typecheck、unit、build、pack 和消费者测试。
- 确认首次公开版本号；未正式发布过时建议从 `0.1.0` 开始。
- 暂停新增低优先级组件，先完成扩展契约收口。

验收：当前应用与三个 tarball 均能构建。

### 阶段 1：创建独立仓库骨架

- 创建新 Git 仓库，但暂不发布 npm。
- 建立最小根 `package.json` 和 `pnpm-workspace.yaml`。
- 配置 Node、pnpm、TypeScript、ESLint、Vitest、Vite 和 Changesets。
- 创建 `packages`、`playgrounds`、`tooling` 和 `tests` 目录。

验收：空仓库可以 `pnpm install --frozen-lockfile`。

### 阶段 2：迁移 tooling

- 将当前包边界、产物验证和消费者验证脚本迁入 `tooling/scripts`。
- 将 `packages/tsconfig.base.json` 调整为新仓库共享配置。
- 统一包级 Vite 配置，减少三个包之间的重复构建代码。
- 保持所有脚本只依赖新仓库，不允许引用后台应用路径。

验收：tooling 可以在没有后台 `src` 目录的情况下运行。

### 阶段 3：迁移三个包

- 先迁移 theme 和 code editor，再迁移主 ProComponents 包。
- 保持 package name、exports、style 路径和 peerDependencies 不变。
- 将 repository、homepage、bugs 改为新仓库地址。
- 检查所有源码只能引用包内相对路径和声明的外部依赖。

验收：三个包分别通过 typecheck、lint、unit、build 和 pack。

### 阶段 4：迁移文档与 Playground

- 从当前 `docs` 中只抽取组件 API、设计规范和组件示例。
- 将后台权限、路由、菜单和 Layout 文档留在原仓库。
- 建立不依赖 PageWrapper、Store 或路由权限的基础 Playground。
- 将 tarball consumer 放入 `playgrounds/consumer` 或 `tests/consumer`。

验收：文档和示例只依赖三个公开包及其 peer dependencies。

### 阶段 5：独立仓库全量验收

- 根类型检查。
- 三包单元测试。
- 包边界审计。
- 三包构建和 tarball 内容检查。
- 临时消费者安装、类型检查和 Vite build。
- 组件 Playground 的暗黑、窄屏和关键交互测试。

验收：整个过程不读取原后台仓库文件。

### 阶段 6：手动发布首个版本

发布不依赖 GitHub：

```bash
pnpm changeset
pnpm release:status
pnpm release:version
pnpm verify:release
npm login --scope=@framebase
pnpm changeset publish
```

发布前先分别执行 `pnpm publish --dry-run --access public` 检查内容。GitHub Actions 可以保留为可选的自动验收，但不是发布入口。

验收：npm 上三个包版本和本地 changeset 版本一致。

### 阶段 7：后台应用切换依赖

- 第一阶段使用新仓库打出的本地 `.tgz` 验证应用。
- 验证通过后，将 `workspace:*` 改为明确 npm 版本。
- 删除 Vite 中指向本地包源码的 alias。
- 重新运行后台应用的 typecheck、unit、E2E 和 build。

验收：后台应用不再读取本仓库 `packages` 目录。

### 阶段 8：清理原仓库

- 删除已经迁移的三个 package 源码。
- 删除只服务于组件包的构建和发布脚本。
- 保留后台集成示例和组件使用文档链接。
- 在原仓库 README 中注明组件库的新地址和版本要求。

验收：两个仓库职责清晰，后台仓库只作为组件消费者。

## 7. Git 历史迁移

推荐使用路径白名单保留相关历史，而不是复制整个后台仓库历史：

```text
packages/pro-components
packages/element-plus-theme
packages/pro-code-editor
packages/tsconfig.base.json
.changeset
tests/package-consumer
build/scripts/audit-package-boundaries.ts
build/scripts/verify-package-artifacts.ts
build/scripts/verify-package-consumer.ts
```

可以使用 `git filter-repo` 生成迁移分支，也可以在新仓库使用一次干净初始提交。若组件历史没有独立审查价值，优先选择干净提交，维护成本更低。

## 8. 最终完成标准

- [ ] 新仓库只包含组件库、主题、编辑器、文档、Playground 和 tooling。
- [ ] 三个包可以独立发布和独立升级。
- [ ] 手动发布流程不依赖 GitHub。
- [ ] 业务用户不会安装 tooling、测试或 Playground 依赖。
- [ ] 后台应用只通过 npm 版本消费组件。
- [ ] 原仓库和新仓库不存在双份可修改源码。
- [ ] 公共 API、子路径和样式导入保持兼容。
