# 目录说明

以下是 `src/` 目录的结构与职责说明。

```
src/
├── access/          # 权限鉴权插件，注册 $hasAuthorize / $hasRole 全局属性
├── api/             # 接口定义，按业务模块分文件（user / order / permission / todos / file）
├── application/     # 应用上下文（app-provider / context / use-appInject）
├── app-loading/     # 应用启动 loading
├── assets/          # 静态资源（svg / svg-icons）
├── components/      # 全局通用组件
├── config/          # 项目配置（project-setting.ts 含布局 / 主题 / 权限模式默认值）
├── directive/       # 自定义指令（context-menu / watermark）
├── enum/            # 枚举（permission / storage / date）
├── hooks/           # 组合式函数（use-echarts / use-layout-menu / use-table / use-tabs 等）
├── layouts/         # 布局（basic-layout 含 header / sidebar / mix-sidebar / tab-page / setting）
├── micro-app/       # qiankun 微前端相关
├── mocks/           # MSW mock 数据（data/ 含 auth / order / permission / user，server/ 含 handlers）
├── plugins/         # 插件装配（elementPlus / echarts / nprogress / unocss / dayJs / components）
├── router/          # 路由引擎（engine/）+ guard（守卫）+ helper（辅助）+ routes（模块）
├── service/         # axios 封装，导出 basicApiService / service / fileService
├── sso/             # 单点登录
├── store/           # pinia（modules/ 含 layout / permissions / route / tab-page / user）
├── styles/          # 全局样式（global-var.scss / global.scss / index.scss）
├── utils/           # 工具（es / encrypt / tree-helper / theme / color / date / file 等）
├── views/           # 页面（login / redirect / error / system）
├── App.vue
└── main.ts          # 应用入口
```

## 主要目录说明

### access

权限鉴权插件。通过 `defineAppPlugin` 注册 `$hasAuthorize`、`$hasRole` 两个全局属性，供模板中按钮级权限控制使用。

### api

接口定义层，按业务模块拆分文件，例如 `user.ts`、`order.ts`、`permission.ts`、`todos.ts`、`file.ts`。每个文件通过 `service` / `basicApiService` 发起请求。

### components

全局通用组件，每个组件一个目录（含 `index.ts` 出口）：

- `anchor` 锚点
- `authority` 权限包裹组件
- `context-menu` 右键菜单
- `docx-preview` / `pdf-preview` / `xlsx-preview` 文档预览
- `echarts` 图表
- `icon` 图标（ep / svg 扩展）
- `iframe` 内嵌页面
- `page-card` / `page-wrapper` 页面容器
- `pro-tabs` 标签页
- `qrcode` 二维码
- `segmented` 分段器
- `tinymce` 富文本
- `tips` 提示
- `transition` 过渡
- `tree` 树形
- `watermark` 水印

### config

项目配置。`project-setting.ts` 定义 `ProjectConfig`，含主题色、布局模式、权限模式（默认 `ROUTE_MAPPING`）等默认值，并以 `readonly` 形式导出。

### hooks

组合式函数：

- `use-echarts` 图表
- `use-layout-menu` 布局菜单
- `use-table` 表格
- `use-tabs` 标签栏
- `layout-config/` 布局配置（含 `use-theme-color` 主题色）
- `core/` `event/` `web/` 等基础 hooks

### layouts

布局体系。`basic-layout` 为主布局，包含 `header`、`sidebar`、`mix-sidebar`、`tab-page`、`setting`（抽屉式配置面板）等子组件；`layout-package` 为可复用的布局基础组件。

### mocks

基于 MSW 的 mock 层：

- `data/` mock 数据源（auth / order / permission / user）
- `server/` handlers 处理逻辑
- `browser.ts` / `node.ts` 分别为浏览器与 node 环境入口

### router

路由引擎与守卫：

- `engine/` 路由引擎（`create-route-engine`、`system-route-engine`）
- `guard/` 全局守卫
- `helper/` 路由辅助（扁平化、动态导入、匹配等）
- `routes/modules/` 路由模块（core / examples / showcase）
- `constant.ts` 导出 `Layout`、`BlankContainer` 等常量

### service

axios 封装，导出三个服务实例：

- `basicApiService`：mock 用，`baseURL` 为 `VITE_APP_MOCK_API_BASE_URL`。
- `service`：真实后端，`baseURL` 为 `config.baseApiUrl`。
- `fileService`：文件服务。

### store

pinia 状态管理，`modules/` 下包含 `layout`、`permissions`、`route`、`tab-page`、`user` 等模块。

### views

页面目录：

- `login/` 登录
- `redirect/` 重定向中转
- `error/` 错误页（403 / 404 / 500）
- `system/` 业务页面（about / charts / components / examples / feature / out / system）

### main.ts

应用入口，负责创建应用实例、装配插件、挂载路由与 pinia、初始化 mock 与权限。
