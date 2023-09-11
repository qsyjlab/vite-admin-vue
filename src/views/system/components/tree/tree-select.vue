<template>
  <page-wrapper>
    <page-card full header="Tree Select">
      <!-- <el-tree-select v-model="value" :data="data" :render-after-expand="false" /> -->
      <el-divider />
      show checkbox: {{ value }}
      <el-tree-select
        v-model="value"
        :data="data"
        check-strictly
        :render-after-expand="false"
        @current-change="nodeClick"
        @change="treeSelectChange"
      />
    </page-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { PageWrapper, PageCard } from '@/components'
import { ref } from 'vue'

const value = ref()

const treeSelectChange = (...rest: any[]) => {
  // console.log('rest', rest)
}

const nodeClick = (...rest: any[]) => {
  console.log('rest nodeClick', rest)
}

const data = [
  {
    value: '1',
    label: 'Level one 1',
    children: [
      {
        value: '1-1',
        label: 'Level two 1-1',
        children: [
          {
            value: '1-1-1',
            label: 'Level three 1-1-1'
          }
        ]
      }
    ]
  },
  {
    value: '2',
    label: 'Level one 2',
    children: [
      {
        value: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            value: '2-1-1',
            label: 'Level three 2-1-1'
          }
        ]
      },
      {
        value: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            value: '2-2-1',
            label: 'Level three 2-2-1'
          }
        ]
      }
    ]
  },
  {
    value: '3',
    label: 'Level one 3',
    children: [
      {
        value: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            value: '3-1-1',
            label: 'Level three 3-1-1'
          }
        ]
      },
      {
        value: '3-2',
        label: 'Level two 3-2',
        children: [
          {
            value: '3-2-1',
            label: 'Level three 3-2-1'
          }
        ]
      }
    ]
  }
]
</script>
<style scoped></style>
