# 项目优化待办清单

## 阶段 1 · 清理死代码（已完成）

- [x] 删除 `Table.vue`（旧 qs-table demo，无引用）
- [x] 删除 `Upload.vue`（旧 demo，已被 pro-upload 取代）
- [x] 删除 `tree/tree-select.vue`（旧 el-tree-select 测试，无引用）
- [x] 删除 `out/micro-app/iframe.vue`（含 localhost 占位，无引用）
- [x] 删除 `pro-form/config/index.ts`（测试字段残留，无引用）
- [x] 删除 `showcase/icon.ts`（空模块）
- [x] 删除 `feature/excel/import.vue` + 路由注册（功能与 preview 重叠，合并到 preview）
- [x] 清理 `mocks/data/permission.ts` 死数据（保留 RouteModule 类型，删 allRouteModules/permissionsMap/allPermissionStringKeys 及第 1-410 行旧路由数据）
- [x] 清理 `mocks/data/auth.ts` 中 ExcelImport 相关引用（allRouteNames 数组 + adminBackendMenus 中的 ExcelImport 节点）
- [x] 修正 `core/link.ts` 中 Qiankun `path: '/sub-vite'` → `'sub-vite'`（绝对路径会解析到顶级）
- [x] 验证：test:types 通过 + 137 单测全通过

## 阶段 2 · 动态路由收尾（已完成）

- [x] 验证 ROUTE_MAPPING / ROLE / BACKED 三种权限模式实际渲染
  - e2e 测试 `e2e/mock-login-modes.e2e.ts` 覆盖 7 个用例（ROUTE_MAPPING 3 账号 + ROLE 2 账号 + BACKED 2 账号），验证菜单差异化与页面访问
- [x] 补运行时模式切换 UI 入口（setPermissionMode 已具备，缺 UI）
  - 在 `setting-draver.vue` 系统布局配置抽屉新增「权限模式」section，用 el-segmented 三选一
  - 切换流程：confirm 确认 → setPermissionMode → loadDynamicRoutes 重建路由 → router.replace 到 Welcome
  - 持久化到 localStorage，退出登录时保留模式
- [x] 确认组件级鉴权 $hasAuthorize / $hasRole 在三种模式下生效
  - 在 `access-control.vue` 新增「组件级鉴权演示」卡片，含 $hasAuthorize / $hasRole / `<Authority>` 组件
  - 三种模式登录响应均返回 permissions + roles 数组，$hasAuthorize（依赖 permissions）与 $hasRole（依赖 roles）机制上均生效
  - admin 对 System/super 返回 true，editor/viewer 返回 false，与路由过滤结果一致

## 阶段 3 · 页面美化

- [ ] 以风格 A（content-publish / dashboard-list）为基准沉淀统一页面骨架（ProCard + 渐变头部 + 统计卡 + 响应式 grid）
- [ ] 改造 `/components` 下风格 B 空洞页（pro-table-page / echarts / anchor / segmented / context-menu 等）
- [ ] 统一头部实现为自定义 `.xxx-page__header`，废止 page-card header 属性与内联 style

## 阶段 4 · MSW 迁移（已完成）

- [x] 装包 `msw` + 生成 `public/mockServiceWorker.js`
- [x] 新增 `src/mocks/browser.ts`（setupWorker）+ `src/mocks/node.ts`（setupServer，按需在集成测试内启用）
- [x] 改写 `handlers.ts`：`if` 分发 → `http.*` 声明式数组（data 文件复用，246 行 → 205 行）
- [x] `mocks/index.ts` 改为开关驱动 enableMock（VITE_ENABLE_MOCK：true 开 / false 关 / 未设置 dev 开 prod 关）
- [x] `main.ts` 调用 enableMock，移除 cleanupLegacyMockWorker
- [x] 移除 `build/vite/plugins/mock-api.ts` 及 build/vite 各处引用
- [x] env 增加 `VITE_ENABLE_MOCK`（.env=true / .env.prod=false）+ env.d.ts 类型
- [x] 验证：test:types 通过 + 137 单测全通过 + dev server 正常启动
