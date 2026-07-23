# Icon 图标

ProIcon 统一封装项目内常用图标源，通过 `icon` 属性的前缀区分来源。

## 支持的图标源

| 前缀 | 来源            | 说明                                           |
| ---- | --------------- | ---------------------------------------------- |
| ep.  | element-plus    | 使用 `@element-plus/icons-vue`，仅内置常用图标 |
| svg. | 本地 svg 精灵图 | 引用 `src/assets/svg-icons/` 下的 svg 文件     |

> 推荐使用 `ep.` 或 `svg.`，无需额外网络请求，适合内网部署。`icon` 也支持直接传入返回 VNode 的渲染函数。

## Props

| 属性  | 说明                                                  | 类型                    | 默认值 |
| ----- | ----------------------------------------------------- | ----------------------- | ------ |
| icon  | 图标标识，格式 `前缀.图标名`；或返回 VNode 的渲染函数 | string \| (() => VNode) | -      |
| size  | 图标尺寸（px）                                        | number                  | 24     |
| color | 图标颜色                                              | string                  | -      |

## 用法

```vue
<script setup lang="ts">
import { ProIcon } from '@/components/icon'
</script>

<template>
  <!-- element-plus 图标 -->
  <ProIcon :size="18" icon="ep.home-filled" color="#1677ff" />

  <!-- 本地 svg 精灵图（svg-icons 目录下的文件名） -->
  <ProIcon :size="18" icon="svg.moon" />
</template>
```

## 图标名说明

- **ep.**：后接 kebab-case 名称，仅支持内置映射的常用图标，如 `home-filled`、`setting`、`edit`、`refresh`、`close`、`arrow-left`、`arrow-right`、`more-filled` 等，完整列表见 `src/components/icon/src/ep.vue` 中的 `epIconMap`。
- **svg.**：后接 `src/assets/svg-icons/` 目录下 svg 文件名（不含扩展名），组件引用 `#icon-文件名` 精灵图符号。
