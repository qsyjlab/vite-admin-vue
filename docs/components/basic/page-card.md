# PageCard 页面卡片

页面内容容器，提供统一的卡片样式与 header 区域。

## Props

| 属性   | 说明         | 类型    | 默认值 |
| ------ | ------------ | ------- | ------ |
| header | 头部标题文字 | string  | -      |
| full   | 是否充满容器 | boolean | false  |

## Slots

| 插槽名  | 说明                                 |
| ------- | ------------------------------------ |
| header  | 头部内容，存在时优先于 `header` 属性 |
| default | 主体内容                             |

## 用法

```vue
<script setup lang="ts">
import { PageCard } from '@/components/page-card'
</script>

<template>
  <PageCard header="基础信息"> 内容 </PageCard>
</template>
```

## 自定义 header

```vue
<PageCard>
  <template #header>
    <span>自定义标题</span>
  </template>
  内容
</PageCard>
```
