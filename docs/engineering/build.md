# 构建与部署

## 构建工具

项目基于 Vite 8 构建，构建相关配置在 `vite.config.ts`，插件与代理封装在 `build/vite/`。

## 构建命令

| 命令                  | 说明                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------- |
| `pnpm build`          | 开发模式构建（默认 mode）                                                               |
| `pnpm build:prod`     | 生产模式构建（`--mode prod`，预分配 `NODE_OPTIONS=--max-old-space-size=8192` 避免 OOM） |
| `pnpm build:packages` | 构建内部包（monorepo 下的三个 `@framebase/*` 包）                                       |

构建产物按 mode 区分输出目录：`dist_${mode}`（如生产构建为 `dist_prod/`）。

## 环境模式

环境变量文件位于项目根目录 `env/`，由 `loadEnv` 读取：

- `env/.env`：默认环境（开发）
- `env/.env.prod`：生产环境（`--mode prod` 加载）

## 关键环境变量

| 变量                         | 说明                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| `VITE_APP_API_BASE_URL`      | 真实后端地址（代理路径，默认 `/proxy-api`）                                                      |
| `VITE_APP_MOCK_API_BASE_URL` | mock 接口地址（默认 `/basic-api`，由 MSW 拦截）                                                  |
| `VITE_ENABLE_MOCK`           | mock 开关：`true`=dev+prod 启用，`false`=完全关闭，未设置=仅 dev 启用；`prod` 构建建议设 `false` |
| `ENABLE_LEGACY`              | 是否启用 `@vitejs/plugin-legacy` 兼容打包                                                        |
| `SERVER_PROXY_LIST`          | 开发代理配置，二维数组格式，如 `[["/proxy-api","http://localhost:9002"]]`                        |
| `BASE_URL`                   | vite `base`，默认 `./`（相对路径）                                                               |

`SERVER_PROXY_LIST` 会被读取并转成 vite 的 `server.proxy`，将 `VITE_APP_API_BASE_URL` 的请求转发到对应后端地址。

## 预览

```sh
pnpm preview
```

本地预览构建结果。

## 部署

- 构建产物在 `dist_${mode}/`（生产为 `dist_prod/`）。
- `BASE_URL` 默认 `./`（相对路径），部署到子路径时需修改 `env/.env.prod` 的 `BASE_URL`（如 `/admin/`）。
- 生产构建建议将 `VITE_ENABLE_MOCK` 设为 `false`。

## monorepo 包构建

项目为 pnpm monorepo，内部包位于 `packages/`，构建脚本在 `build/scripts/`，使用 changesets 管理版本和发布。

| 包名                                     | 说明       |
| ---------------------------------------- | ---------- |
| `@framebase/element-plus-pro-components` | Pro 组件库 |
| `@framebase/vue-code-editor`             | 代码编辑器 |
| `@framebase/element-plus-theme`          | 主题       |

相关命令：

| 命令                   | 说明           |
| ---------------------- | -------------- |
| `pnpm build:packages`  | 构建三个内部包 |
| `pnpm pack:packages`   | 打包并校验产物 |
| `pnpm changeset`       | 新增 changeset |
| `pnpm release:status`  | 查看待发布状态 |
| `pnpm release:version` | 更新版本号     |
| `pnpm release:publish` | 校验并发布     |
