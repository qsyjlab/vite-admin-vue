<template>
  <page-wrapper>
    <page-card header="tree">
      <pre>
        {{ keys }}
      </pre>
      <tree v-model="keys" :data="data" />
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { PageWrapper, PageCard, Tree } from '@/components'
import { ref } from 'vue'

interface ITree {
  label: string
  id: number
  children?: ITree[]
}

const keys = ref<any>([1, 4])

const data: ITree[] = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1'
          },
          {
            id: 10,
            label: 'Level three 1-1-2'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1'
      },
      {
        id: 6,
        label: 'Level two 2-2'
      }
    ]
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1'
      },
      {
        id: 8,
        label: 'Level two 3-2'
      }
    ]
  }
]
</script>
<style scoped></style>
