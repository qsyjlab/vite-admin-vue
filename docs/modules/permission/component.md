# 组件级鉴权

权限模式控制的是路由与菜单级别的过滤，组件级鉴权用于在页面/组件内部按权限或角色控制元素的渲染。项目提供函数式、全局属性、组件式三种用法。

## 函数式权限

`usePermissionStore().hasPermission(auth)`，依赖 `permissions` 数组：

- 字符串入参：`permissions.includes(auth)`
- 数组入参：`auth.every(p => permissions.includes(p))`，**AND 语义**（必须全部命中）

```ts
// src/store/module/permissions.ts
function hasPermission(auth?: string | string[]) {
  if (!auth) return false

  if (Array.isArray(auth)) return auth.every(p => permissions.value.includes(p))
  return permissions.value.includes(auth)
}
```

使用示例：

```vue
<script setup lang="ts">
import { usePermissionStore } from '@/store'

const { hasPermission } = usePermissionStore()
</script>

<template>
  <!-- 单个权限字符串 -->
  <el-button v-if="hasPermission('System')">系统设置</el-button>

  <!-- 数组：AND 语义，需同时拥有 System 和 User -->
  <el-button v-if="hasPermission(['System', 'User'])">用户管理</el-button>
</template>
```

## 函数式角色

`useUserStore().hasRole(auth)`，依赖 `roles` 数组：

- 字符串入参：`roles.includes(auth)`
- 数组入参：`auth.some(r => roles.includes(r))`，**OR 语义**（任一命中即可）

```ts
// src/store/module/user.ts
hasRole(auth) {
  if (!auth) return false
  if (Array.isArray(auth))
    return auth.map(String).some(r => this.roles.map(String).includes(String(r)))
  return this.roles.map(String).includes(String(auth))
}
```

使用示例：

```vue
<script setup lang="ts">
import { useUserStore } from '@/store'

const { hasRole } = useUserStore()
</script>

<template>
  <!-- 单个角色 -->
  <el-button v-if="hasRole('admin')">管理员操作</el-button>

  <!-- 数组：OR 语义，admin 或 super 均可 -->
  <el-button v-if="hasRole(['admin', 'super'])">高危操作</el-button>
</template>
```

::: warning 注意语义差异
`hasPermission` 数组入参是 **AND 语义**，`hasRole` 数组入参是 **OR 语义**，两者不一致，使用时务必留意。
:::

## 全局属性

模板中可直接使用 `$hasAuthorize(auth)` 与 `$hasRole(auth)`，由 `src/access/index.ts` 注册到 `app.config.globalProperties`。

```ts
// src/access/index.ts
export function hasAuthorize(auth: string) {
  const { hasPermission } = usePermissionStore()
  return hasPermission(auth)
}

export function hasRole(role: string) {
  const { hasRole } = useUserStore()
  return hasRole(role)
}

export default defineAppPlugin(app => {
  const globalProperties = app.config.globalProperties
  globalProperties['$hasAuthorize'] = hasAuthorize
  globalProperties['$hasRole'] = hasRole
})
```

> 全局属性包装函数的入参签名为 `string`（单字符串）。如需数组语义，请使用函数式 `hasPermission` / `hasRole`。

使用示例：

```vue
<template>
  <el-button v-if="$hasAuthorize('System')">系统设置</el-button>
  <el-button v-if="$hasRole('admin')">管理员操作</el-button>
</template>
```

## 组件式

`<Authority>` 组件提供声明式鉴权，定义在 `src/components/authority`。内部基于 `hasPermission` 实现，`value` 为权限字符串或数组（数组走 AND 语义）。

```vue
<script setup lang="ts">
import { Authority } from '@/components/authority'
</script>

<template>
  <!-- 字符串 -->
  <Authority value="System">
    <el-button>系统设置</el-button>
  </Authority>

  <!-- 数组：AND 语义 -->
  <Authority :value="['System', 'User']">
    <el-button>用户管理</el-button>
  </Authority>
</template>
```

组件实现非常简洁，本质就是把 `hasPermission` 包成一个 `v-if`：

```vue
<!-- src/components/authority/src/authority.vue -->
<script lang="ts">
import { defineComponent } from 'vue'
import { definePropType } from '@/utils'
import { usePermissionStore } from '@/store'

export default defineComponent({
  name: 'Authority',
  props: {
    value: {
      type: definePropType<string | string[]>([Array, String])
    }
  },

  setup(props, { slots }) {
    const { hasPermission } = usePermissionStore()
    return () => {
      return hasPermission(props.value) ? slots.default?.() : null
    }
  }
})
</script>
```

## 三种模式下的生效情况

组件级鉴权依赖 `permissions` / `roles` 数组是否被正确填充，因此与权限模式有关：

| 模式            | permissions        | roles              | 生效情况                                              |
| --------------- | ------------------ | ------------------ | ----------------------------------------------------- |
| `ROUTE_MAPPING` | 登录响应返回       | 登录响应返回       | `hasPermission` 与 `hasRole` 均生效                   |
| `ROLE`          | 登录响应返回       | 登录响应返回       | `hasPermission` 与 `hasRole` 均生效                   |
| `BACKED`        | 取决于后端是否返回 | 取决于后端是否返回 | 取决于后端 `getMenuList()` 响应是否包含 `permissions` |

登录响应的处理在 `src/store/module/user.ts` 的 `loginAfterInitialize`：

```ts
// 从登录响应中提取角色值
const roleValues = Array.isArray(data.roles)
  ? data.roles.map((r: any) => (typeof r === 'object' ? r.value : r))
  : []
this.setRoles(roleValues)

const permission = usePermissionStore()
permission.setPermissions(data.permissions || [])
await permission.loadDynamicRoutes()
```

::: tip
`ROUTE_MAPPING` 与 `ROLE` 模式下，前端路由过滤与组件级鉴权使用同一份 `permissions` / `roles` 数据。`BACKED` 模式下若后端未返回 `permissions`，则 `hasPermission` / `$hasAuthorize` / `<Authority>` 始终返回 `false`，需后端配合返回。
:::
