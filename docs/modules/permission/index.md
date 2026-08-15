# 权限模式

项目支持三种权限模式，枚举定义在 `src/enum/permission.ts`：

| 模式     | 枚举值          | 说明                                                  |
| -------- | --------------- | ----------------------------------------------------- |
| 路由映射 | `ROUTE_MAPPING` | 按用户拥有的路由 `name` 列表过滤菜单（默认模式）      |
| 角色映射 | `ROLE`          | 按路由 `meta.roles` 过滤，父路由不匹配时整棵子树移除  |
| 后端菜单 | `BACKED`        | 后端返回菜单树，前端用 `transformObjToRoute` 动态渲染 |

```ts
// src/enum/permission.ts
export enum PermissionModeEnum {
  /** 角色权限 */
  ROLE = 'ROLE',
  /** 路由权限映射 */
  ROUTE_MAPPING = 'ROUTE_MAPPING',
  /** 后端菜单映射 */
  BACKED = 'BACKED'
}
```

## 模式切换

### 配置默认值

在 `src/config/project-setting.ts` 的 `permissionMode` 字段配置项目默认权限模式，默认值为 `ROUTE_MAPPING`。

```ts
// src/config/project-setting.ts
const setting = readonly<ProjectConfig>({
  // ...
  permissionMode: PermissionModeEnum.ROUTE_MAPPING
})
```

### 运行时切换

支持两处运行时切换入口：

1. **登录页下拉选择**：登录表单中的「选择权限模式」下拉框，见 `src/views/login/login.vue`。
2. **设置抽屉**：登录后点击右上角设置按钮，打开「系统布局配置」抽屉中的权限模式分段器，见 `src/layouts/basic-layout/components/setting/setting-draver.vue`。

### 存储

权限模式持久化到 `localStorage`，存储 key 为 `_PERMISSION_MODE_`（枚举 `StorageKeys.PERMISSION_MODE`），实际写入时会带上 `storagePrefix` 前缀（默认 `_BASIC_`，见 `src/config/index.ts` 的 `storage.prefix`）。

相关缓存读写函数在 `src/store/local/index.ts`：

- `setPermissionModeCache(mode)`
- `getPermissionModeCache()`

### setPermissionMode 方法

切换模式的核心方法在 `src/store/module/permissions.ts` 的 `setPermissionMode`：

```ts
// src/store/module/permissions.ts
function setPermissionMode(mode: keyof typeof PermissionModeEnum) {
  permissionMode.value = mode
  setPermissionModeCache(mode)
  // 模式切换后需要重新生成签名，强制下次 loadDynamicRoutes 重新加载
  dynamicRoutesSignature.value = ''
}
```

调用后会清空 `dynamicRoutesSignature`，强制下次 `loadDynamicRoutes` 重新构建路由。

### 立即生效

`setPermissionMode` 只更新状态与缓存，**不会自动重建路由**。运行时切换需手动调用 `loadDynamicRoutes` 并跳转才能立即生效：

```ts
import { usePermissionStore } from '@/store'
import { useRouter } from 'vue-router'

const permissionStore = usePermissionStore()
const router = useRouter()

permissionStore.setPermissionMode('ROLE')
await permissionStore.loadDynamicRoutes()
router.replace({ name: 'Welcome' })
```

设置抽屉中的切换逻辑（`handlePermissionModeChange`）即采用此流程，并会弹出二次确认框提示「切换权限模式将重新生成路由并跳转到首页」。

## 忽略权限

路由 `meta.ignoreAuth: true` 的路由在所有模式下都会被放行，不参与权限过滤。

```ts
{
  path: '/about',
  name: 'About',
  meta: {
    ignoreAuth: true,
    title: '关于'
  }
}
```

## 模式差异

### 数据来源与过滤逻辑

路由过滤的入口在 `src/router/engine/system-route-engine.ts` 的 `resolvePermissionRoutes`，根据当前模式分派到不同的过滤器：

| 维度     | ROUTE_MAPPING                          | ROLE                                          | BACKED                          |
| -------- | -------------------------------------- | --------------------------------------------- | ------------------------------- |
| 数据来源 | 前端路由模块 + `permissions` 数组      | 前端路由模块 + `roles` 数组                   | 后端 `getMenuList()` 返回菜单树 |
| 过滤器   | 通用 `filter`，按 `name ∈ permissions` | 专用 `filterByRole`，按 `meta.roles` 整树过滤 | 不过滤，直接用后端数据          |
| 签名依据 | `mode` + 排序后的 `permissions`        | `mode` + 排序后的 `roles`                     | 仅 `mode`                       |

### ROUTE_MAPPING 路由映射

按路由 `name` 是否在用户 `permissions` 数组中过滤。`name` 为空或 `meta.ignoreAuth` 为真的路由直接放行。

```ts
function routeMappingFilter(route: RouteRecordRaw) {
  const name = route.name
  if (!name) return true
  if (route.meta?.ignoreAuth) return true
  return permissions.includes(String(name))
}

return filter(routes, routeMappingFilter, { id: 'name' })
```

### ROLE 角色映射

使用专用的 `filterByRole` 树过滤。与通用 `filter` 的关键差异：**当父路由的 `meta.roles` 不匹配时，整棵子树都会被移除**，不会因子路由未声明 `roles` 而保留父路由。

```ts
// 路由声明了 roles 但用户不具备任何角色 —— 整棵子树移除
if (routeRoles?.length) {
  const hasRole = routeRoles.some(role => roleSet.has(role))
  if (!hasRole) return false
}
```

### BACKED 后端菜单

前端不再过滤，直接使用后端返回的菜单树。`loadDynamicRoutes` 会先调用 `getMenuList()` 拉取后端路由数据，再通过 `transformObjToRoute`（`src/router/helper/dynamic.ts`）把后端的字符串 `component` 字段转换成懒加载组件：

- `component === 'LAYOUT'`：映射为布局组件
- 其他字符串：作为 `src/views/` 下的视图路径，通过 `import.meta.glob` 动态导入

### 动态路由签名

`getDynamicRoutesSignature` 用于判断是否需要重新加载动态路由，签名相同时 `loadDynamicRoutes` 直接跳过：

```ts
function getDynamicRoutesSignature() {
  const mode = permissionMode.value

  if (mode === PermissionModeEnum.ROUTE_MAPPING) {
    return JSON.stringify([mode, [...permissions.value].map(String).sort()])
  }

  if (mode === PermissionModeEnum.ROLE) {
    return JSON.stringify([mode, [...(userStore.roles || [])].map(String).sort()])
  }

  return mode // BACKED 仅以 mode 作为签名
}
```
