# 测试

## 测试框架

| 类型       | 框架                          | 配置文件               |
| ---------- | ----------------------------- | ---------------------- |
| 单元测试   | Vitest 1.5（含 `@vitest/ui`） | `vitest.config.ts`     |
| 端到端测试 | Playwright 1.61               | `playwright.config.ts` |

## 命令

| 命令               | 说明                                                       |
| ------------------ | ---------------------------------------------------------- |
| `pnpm test`        | 单测（UI 模式）                                            |
| `pnpm test:unit`   | 单测（run 模式）                                           |
| `pnpm test:types`  | 类型检查（`vue-tsc -p tsconfig.type-tests.json --noEmit`） |
| `pnpm test:e2e`    | playwright e2e                                             |
| `pnpm test:e2e:ui` | playwright e2e（UI 模式）                                  |
| `pnpm test:pro`    | 类型 + 单测 + e2e 全量                                     |
| `pnpm check`       | 全量类型检查（`vue-tsc -b --noEmit`，预分配大内存）        |

## 单元测试

测试文件与源码同级的 `__tests__/` 目录，例如：

- `src/utils/__tests__/es/is.test.ts`
- `src/utils/__tests__/es/array.test.ts`
- `src/utils/__tests__/es/object.test.ts`
- `src/service/axios-request/__tests__/axios-canceler.test.ts`
- `packages/pro-components/src/.../__tests__/`
- `packages/pro-code-editor/src/.../__tests__/`

当前单测数量：137 个。

## 端到端测试

e2e 测试位于 `e2e/` 目录，匹配 `**/*.e2e.ts`。

| 文件                            | 说明                                                               |
| ------------------------------- | ------------------------------------------------------------------ |
| `mock-login-modes.e2e.ts`       | 三种权限模式（ROUTE_MAPPING / ROLE / BACKED）登录验证，共 7 个用例 |
| `order-crud.e2e.ts`             | 订单 CRUD                                                          |
| `pro-components.e2e.ts`         | Pro 组件交互                                                       |
| `pro-components-closure.e2e.ts` | Pro 组件闭环                                                       |
| `helpers/auth.ts`               | 登录辅助（`loginAsAdmin`、`collectPageErrors`）                    |

playwright 默认复用本地 dev server（`127.0.0.1:4175`），CI 环境下会自动启动；本地默认使用 chrome channel。
