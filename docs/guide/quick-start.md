# 使用

## 环境准备

项目基于 Nodejs，包管理器使用 pnpm。

::: warning 注意

- 推荐 nvm 管理 node 版本
- node >= 20.19，pnpm >=10 <11
- pnpm 安装方法详见[官网](https://pnpm.io/installation)

:::

## 安装

### 安装 pnpm

```sh
npm install -g pnpm
```

pnpm 使用方法具体详见官网。

## scripts

以下为 `package.json` 中的核心脚本：

```json
{
  "scripts": {
    "dev": "vite --host",
    "app:prod": "vite --host --mode prod",
    "build": "vite build",
    "build:prod": "cross-env NODE_OPTIONS='--max-old-space-size=8192' vite build --mode prod",
    "test": "vitest --ui",
    "test:e2e": "playwright test",
    "test:types": "vue-tsc -p tsconfig.type-tests.json --noEmit",
    "test:unit": "vitest run",
    "check": "cross-env NODE_OPTIONS='--max-old-space-size=8192' vue-tsc -b --noEmit",
    "lint": "eslint . --fix",
    "prettier": "prettier --write .",
    "preview": "vite preview"
  },
  "engines": {
    "node": ">= 20.19",
    "pnpm": ">=10 <11"
  }
}
```

常用说明：

- `dev`：本地开发，默认带 `--host`，便于局域网访问。
- `app:prod`：以 `prod` 模式启动开发服务器，配合 `.env.prod`。
- `build:prod`：生产构建（`prod` 模式），预分配大内存避免 OOM。
- `test` / `test:unit`：vitest 单元测试，前者带可视化 UI。
- `test:e2e`：playwright 端到端测试。
- `test:types`：vue-tsc 类型测试。
- `check`：vue-tsc 全量类型检查（构建模式，预分配大内存）。
- `lint` / `prettier`：代码检查与格式化。

## 环境变量

环境变量文件统一放在项目根目录的 `env/` 下：

- `.env`：默认环境变量，开发环境加载。
- `.env.prod`：`prod` 模式加载。
- `.env.example`：模板文件，包含所有可配置项，可作为参考。

### 关键环境变量

| 变量                         | 说明                                                                                | 默认值                                     |
| ---------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------ |
| `VITE_APP_API_BASE_URL`      | 真实后端代理路径，由 vite server.proxy 转发                                         | `/proxy-api`                               |
| `VITE_APP_MOCK_API_BASE_URL` | mock 拦截路径，由 MSW 处理                                                          | `/basic-api`                               |
| `VITE_ENABLE_MOCK`           | mock 开关：`true`=dev+prod 启用；`false`=完全关闭；未设置=仅 dev 启用               | dev 默认启用                               |
| `SERVER_PROXY_LIST`          | vite `server.proxy` 配置，格式为二维数组 `[["/proxy-api","http://localhost:9002"]]` | `[["/proxy-api","http://localhost:9002"]]` |

### 代理说明

`SERVER_PROXY_LIST` 会被读取并转成 vite 的 [server.proxy](https://cn.vitejs.dev/config/server-options.html#server-proxy) 配置，将 `VITE_APP_API_BASE_URL`（默认 `/proxy-api`）的请求转发到对应后端地址（默认 `http://localhost:9002`）。

## 工具配置

推荐 IDE vscode：

- Vue 官方插件（Volar）提供 vue 与 ts 提示。
- ESLint 代码检查。
- Prettier 代码风格格式化。
- DotENV 提供 env 文件高亮。

## 代码获取

### Github

```shell
git clone https://github.com/qsyjlab/vite-admin-vue.git
```

### Gitee

```shell
git clone https://gitee.com/qsyj0522/vite-admin-vue.git
```
