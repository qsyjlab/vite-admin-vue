# Authority 权限组件

声明式鉴权组件，根据当前用户权限控制内容是否渲染。内部调用 `usePermissionStore().hasPermission`。

## Props

| 属性  | 说明                               | 类型               | 默认值 |
| ----- | ---------------------------------- | ------------------ | ------ |
| value | 权限标识，字符串或数组（AND 语义） | string \| string[] | -      |

## 用法

```vue
<script setup lang="ts">
import { Authority } from '@/components/authority'
</script>

<template>
  <!-- 拥有单个权限时显示 -->
  <Authority value="System">有 System 权限时显示</Authority>

  <!-- 数组为 AND 语义：需同时拥有全部权限 -->
  <Authority :value="['System', 'User']">同时拥有 System 和 User 权限时显示</Authority>
</template>
```

> 权限判定逻辑详见 `src/store/module/permissions.ts` 中的 `hasPermission`，权限模式说明见 [组件级鉴权](/modules/permission/component)。
