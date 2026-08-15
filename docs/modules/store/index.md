# Pinia Store

项目使用 Pinia 3 做状态管理，store 定义在 `src/store/`。

## 目录结构

```
src/store
├── pinia.ts          # pinia 实例创建（createPinia）
├── index.ts          # 统一导出，并注册 pinia 到 app
├── module/           # 业务 store
│   ├── index.ts
│   ├── user.ts
│   ├── permissions.ts
│   ├── layout.ts
│   ├── tab-page.ts
│   └── route.ts
└── local/            # localStorage 封装
    └── index.ts
```

- `src/store/pinia.ts`：通过 `createPinia()` 创建 `piniaInstance`。
- `src/store/index.ts`：统一导出 `module` 下的 store，默认导出注册函数（`app.use(piniaInstance)`）。

## 业务 store

### user.ts

用户信息与登录登出。

- state：`userInfo`、`token`、`roles`、`permissions`、`initialized`
- actions：`loginSystem`、`loginOutSystem`、`loginAfterInitialize`、`setUserInfo`、`setToken`、`setRoles`、`hasRole`、`setInitialized`

`hasRole` 支持传入单个角色或数组（数组为「任一命中」即返回 true）。

### permissions.ts

权限与动态路由（setup store）。

- state：`permissions`、`permissionMode`
- actions：`setPermissions`、`getPermissions`、`setPermissionMode`、`getPermissionMode`、`loadDynamicRoutes`、`resetPermissionRoutes`、`hasPermission`

`hasPermission(auth?: string | string[])`：传入数组时为「全部命中」，传入字符串时判断是否包含。

### layout.ts

布局配置。

- state：`layoutConfig`、`mixMenuLayoutConfig`、`isOpenSettig`
- actions：`setLayoutConfig`、`toggleSettingDrawer`、`setShowMixChildrenMenu`

### tab-page.ts

多标签页管理（setup store）。

- getters：`getTabPages`、`getCurrentActivityTabPage`、`getAffixTabsList`、`getKeepAliveCache`
- actions：`addTabPage`、`removeTabPage`、`removeAllTabPage`、`removeOhterTabPages`、`removeLeftAllTabPages`、`removeRightAllTabPages`、`updateTabPage`、`reorderTabPages`、`goTabPage`

### route.ts

路由 keep-alive 缓存。

- state：`keepAliveCache`
- getters：`getAliveCache`
- actions：`addAlive`

## localStorage 封装

`src/store/local/index.ts` 基于 `createStorage` 封装，统一带 `storagePrefix` 前缀（值为 `_BASIC_`）。

主要方法：

| 方法                                                | 说明         |
| --------------------------------------------------- | ------------ |
| `setUserInfoCache` / `getUserInfoCache`             | 用户信息     |
| `setTokenCahce` / `getTokenCahce`                   | token        |
| `setPermissionsCache` / `getPermissionsCache`       | 权限列表     |
| `setPermissionModeCache` / `getPermissionModeCache` | 权限模式     |
| `setRolesCache` / `getRolesCache`                   | 角色         |
| `setLayoutCache` / `getLayoutCache`                 | 布局配置     |
| `clearCache`                                        | 清除全部缓存 |

## 持久化

以下数据通过 localStorage 持久化（前缀 `_BASIC_`）：

- layout 配置（`setLayoutCache`）
- permissionMode（`setPermissionModeCache`）
- token（`setTokenCahce`）
- userInfo（`setUserInfoCache`）
- permissions / roles

`loginOutSystem` 退出登录时会保留 `permissionMode`，清除其余缓存。

## 使用示例

```ts
import { useUserStore, usePermissionStore } from '@/store'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { userInfo, roles } = storeToRefs(userStore)
const { loginSystem } = userStore

const permissionStore = usePermissionStore()
permissionStore.hasPermission('system:user:add')
```

::: tip 组件外使用
在路由守卫等非组件场景调用 store，可使用 user store 暴露的 `useUserStoreOut()`（内部基于 `piniaInstance`），详见 [Pinia 文档](https://pinia.vuejs.org/zh/core-concepts/outside-component-usage.html)。
:::
