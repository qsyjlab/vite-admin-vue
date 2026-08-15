# ProTabs 标签页

多标签页组件，支持拖拽排序、滚动导航、右键菜单与更多操作。布局中的多标签页即基于此组件，参考 `src/layouts/basic-layout/components/tab-page/tab-page.vue`。

## Props

| 属性             | 说明                    | 类型             | 默认值 |
| ---------------- | ----------------------- | ---------------- | ------ |
| tabs             | 标签列表                | ProTabItem[]     | -      |
| model-value      | 当前激活 key（v-model） | string \| number | -      |
| height           | 标签栏高度（px）        | number           | 48     |
| font-size        | 标签文字大小（px）      | number           | 13     |
| draggable        | 是否可拖拽排序          | boolean          | true   |
| show-more-action | 是否显示更多操作按钮    | boolean          | true   |

## Events

| 事件名称           | 说明          | 回调参数                             |
| ------------------ | ------------- | ------------------------------------ |
| update:model-value | 激活 key 变化 | (key: string \| number)              |
| tab-click          | 点击标签      | (tab: ProTabItem)                    |
| tab-close          | 关闭标签      | (tab: ProTabItem, index: number)     |
| contextmenu        | 右键标签      | (event: MouseEvent, tab: ProTabItem) |
| drag-end           | 拖拽排序结束  | (newOrder: string[])                 |

## Slots

| 插槽名    | 说明                                       |
| --------- | ------------------------------------------ |
| more-menu | 更多操作下拉菜单内容（`el-dropdown-item`） |

## Type

```ts
interface ProTabItem {
  /** 唯一标识 */
  key: string
  /** 标签文字 */
  label: string
  /** 图标（ProIcon 的 icon 格式，如 ep.home-filled） */
  icon?: string
  /** 是否可关闭，默认 true；affix 为 true 时强制不可关闭 */
  closable?: boolean
  /** 是否固定（不可关闭、不可拖走） */
  affix?: boolean
}
```

## 用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ProTabs, type ProTabItem } from '@/components/pro-tabs'

const tabs = ref<ProTabItem[]>([
  { key: 'home', label: '首页', icon: 'ep.home-filled', affix: true },
  { key: 'list', label: '列表', closable: true }
])
const active = ref('home')

function onTabClose(_tab: ProTabItem, index: number) {
  tabs.value.splice(index, 1)
}

function onDragEnd(newOrder: string[]) {
  tabs.value = newOrder.map(k => tabs.value.find(t => t.key === k)!).filter(Boolean)
}
</script>

<template>
  <ProTabs
    v-model="active"
    :tabs="tabs"
    :draggable="true"
    :show-more-action="true"
    @tab-close="onTabClose"
    @drag-end="onDragEnd"
  >
    <template #more-menu>
      <el-dropdown-item>关闭其他</el-dropdown-item>
      <el-dropdown-item>关闭全部</el-dropdown-item>
    </template>
  </ProTabs>
</template>
```
