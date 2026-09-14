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

## 阶段 3 · 页面美化（已完成）

- [x] 以风格 A（content-publish / dashboard-list）为基准沉淀统一页面骨架（ProCard + 渐变头部 + 统计卡 + 响应式 grid）
  - 新增 `GPageHeader`（`src/components/page-header/`）：渐变背景头部，支持 title / description / icon 与 `#actions` 插槽，窄屏自动纵向堆叠
  - 新增 `GPageStats`（`src/components/page-stats/`）：统计卡响应式 grid 容器（列数可配，1100px 降 2 列 / 640px 降 1 列），内容用组件库 `ProStatisticCard`
  - 两者走 `G*` 全局组件自动导入，并在 `src/components/index.ts` 导出
- [x] 改造 `/components` 下风格 B 空洞页（pro-table-page / echarts / anchor / segmented / context-menu 等）
  - 5 个点名页全部完成：pro-table（订单统计卡）、echarts（浏览统计卡 + 抽取共享数据 `view-data.ts` 消除两份重复 mock）、anchor、segmented、context-menu
  - 其余旧风格页一并统一：pro-editable-table、pro-table-search、drag-sort-table、pro-form、pro-form-ref、route-engine 5 页（overview / access-control / menu-projection / keep-alive-a / keep-alive-b）、excel 2 页、watermark、image-viwer、tab-page、system/menu、about
  - 有数据支撑的页面补充 `ProStatisticCard` 统计卡，功能页不强加；业务逻辑零改动
- [x] 统一头部实现为自定义 `.xxx-page__header`，废止 page-card header 属性与内联 style
  - 全部 22 个旧 `page-card :header` 页面迁移到 `GPageHeader`；表格页以 `pro-card :body-padding="false"` + flex 链替代 page-card `full`，保持 `auto-fit-height` 自适应
  - 清除容器内联 style（margin-bottom / 定位/高度改用 scoped class）
  - 验证：test:types 通过 + 单测全通过 + 生产构建通过；dev server 逐页截图核对（ECharts / ProTable / segmented / 右键菜单 / 锚点 / 水印 / 标签栏 / 图片预览 / 多表头 / 引擎概览 / 登录与权限 / 菜单管理 / 关于）渲染正常

## 阶段 4 · MSW 迁移（已完成）

- [x] 装包 `msw` + 生成 `public/mockServiceWorker.js`
- [x] 新增 `src/mocks/browser.ts`（setupWorker）+ `src/mocks/node.ts`（setupServer，按需在集成测试内启用）
- [x] 改写 `handlers.ts`：`if` 分发 → `http.*` 声明式数组（data 文件复用，246 行 → 205 行）
- [x] `mocks/index.ts` 改为开关驱动 enableMock（VITE_ENABLE_MOCK：true 开 / false 关 / 未设置 dev 开 prod 关）
- [x] `main.ts` 调用 enableMock，移除 cleanupLegacyMockWorker
- [x] 移除 `build/vite/plugins/mock-api.ts` 及 build/vite 各处引用
- [x] env 增加 `VITE_ENABLE_MOCK`（.env=true / .env.prod=false）+ env.d.ts 类型
- [x] 验证：test:types 通过 + 137 单测全通过 + dev server 正常启动

## 阶段 5 · 路由系统优化（进行中）

- [x] 守卫鉴权时序修复：token 校验前置，匿名访客不再触发后端菜单请求（`7276aa1`）
- [x] `loadDynamicRoutes` 单飞锁，消除登录流程与守卫并发 bootstrap 竞态；BACKED 模式菜单请求失败给出提示（`7276aa1`）
- [x] NProgress 在 `router.onError` 兜底结束；外链 `window.open` 加 noopener；登录 redirect 仅接受站内路径（`7276aa1`）
- [x] 引擎 build 深拷贝 6 次 → 1 次；BACKED 授权边界深拷贝隔离后端数据；`meta.menu` 覆盖字段归一化扩展到注册路由（`a4068a3`）
- [x] 授权逻辑抽取为独立 `authorize.ts`；`dynamic.ts` glob 提升到模块作用域、未命名路由确定性兜底 name（`a4068a3`）
- [x] vitest 补 `@` 别名；新增 17 个路由单测（授权三模式 / 引擎生命周期 / 管线回归）（`a4068a3`）
- [x] 菜单管理页修复：排序列改读 `meta.order`、redirect 列格式化；`ExtraRouteMeta` 补齐 `single/affix/isKeepAlive`（`5c9381b`）
- [ ] keep-alive 缓存生命周期：`useRouteStore` 只有 addAlive 没有 removeAlive，关标签不释放缓存；`tab-page.ts` 的 `updateTabCache` 过滤条件写反（`ignoreKeepAlive` 应取反）；`removeTabPage` 关闭非当前标签也会跳转；关闭左/右侧标签不刷新缓存
- [ ] qiankun 集成修复：`activeRule '/sub-vite/react-swc'` 与实际路由 `/out-page/sub-vite/react-swc` 不匹配；容器 `#react-swc` 元素不存在；`sub-app.ts` 挂载竞态（unmount 早于 setup 完成会泄漏实例）；`start()` 无条件执行且 entry 硬编码 dev 地址；`src/micro-app/index.ts` 空文件
