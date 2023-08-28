
# 权限

目前前端权限大致实现几种方式
- 前端角色权限 （xxx角色可用）
- 前端路由权限 （权限字符串,或者权限code 等）
- 后端返回动态路由表

这里只实现了 权限字符串 来判断权限。如果需要上述的没有的其他两种自行根据业务调整
`src/store/permissions`  `buildPermissionRoutes` 自行实现 需要过滤菜单的 filter


## 忽略权限

路由 meta 中 `ignoreAuth: true` 忽略菜单权限


## 细粒度权限
### 函数式
``` ts
import { usePermissionStore } from '@/store'
const { hasPermission } = usePermissionStore()
hasPermission([])
```

### 组件式
``` ts
import { Authority } from '@/components/authority'
const { hasPermission } = usePermissionStore()

<Authority value="">内容</Authority>
<Authority :value="[]">内容</Authority>

```


