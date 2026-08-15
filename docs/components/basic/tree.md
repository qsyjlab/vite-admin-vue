# Tree 树组件

基于 `el-tree` 封装，支持 `v-model` 双向绑定选中 key。根据 `show-checkbox` 自动切换为复选框勾选或单选高亮模式。

## Props

| 属性              | 说明                  | 类型                 | 默认值 |
| ----------------- | --------------------- | -------------------- | ------ |
| model-value       | 选中 key（v-model）   | any                  | -      |
| data              | 树数据                | TreeInstance['data'] | -      |
| node-key          | 节点唯一标识字段      | string               | 'id'   |
| tree-props        | el-tree 的 props 配置 | TreeProps            | -      |
| show-checkbox     | 是否显示复选框        | boolean              | true   |
| highlight-current | 是否高亮当前节点      | boolean              | true   |

## Events

| 事件名称           | 说明          | 回调参数   |
| ------------------ | ------------- | ---------- |
| update:model-value | 选中 key 变化 | (val: any) |

## 用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Tree } from '@/components/tree'

const data = ref([{ id: 1, label: '一级 1', children: [{ id: 2, label: '二级 1-1' }] }])
const checkedKeys = ref<number[]>([])
</script>

<template>
  <Tree v-model="checkedKeys" :data="data" node-key="id" />
</template>
```

> 组件透传 `el-tree` 的能力，类型定义见 `src/components/tree/src/types.ts`，详细 API 见 `src/components/tree/src/tree.vue`。
