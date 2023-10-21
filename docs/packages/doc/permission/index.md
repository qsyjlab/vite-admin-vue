# 权限

目前前端权限大致实现几种方式

- 前端角色权限 （xxx 角色可用）
- 前端路由权限 （权限字符串,或者权限 code 等）
- 后端返回动态路由表

这里只实现了 权限字符串 来判断权限。如果需要上述的没有的其他两种自行根据业务调整
`src/store/permissions` `buildPermissionRoutes` 自行实现 需要过滤菜单的 filter

## 忽略权限

路由 meta 中 `ignoreAuth: true` 忽略菜单权限

## 细粒度权限

### 函数式

```ts
import { usePermissionStore } from '@/store'
const { hasPermission } = usePermissionStore()
hasPermission([])
```

### 组件式

```ts
import { Authority } from '@/components/authority'
const { hasPermission } = usePermissionStore()

<Authority value="">内容</Authority>
<Authority :value="[]">内容</Authority>

```

### 指令

执行虽实现但不推荐使用指令权限。指令权限本质是在 dom 加载完成后 插入移除 dom 元素，这会出现元素 闪现突然消失的情况。对于性能也并不是一个好的选择，指令加载也表示 dom 元素已经加载完了。 推荐组件式 和 函数式 `v-if` 来处理权限，理由是 `v-if` 和 组件式 最接近于底层， 并不会做无意义的渲染。

```ts
// v-if 底层做到的执行逻辑
是否含有权限 ? h('内容') : null
```
