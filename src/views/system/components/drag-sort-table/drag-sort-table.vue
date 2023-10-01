<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <drag-sort-table
        :columns="columns"
        mode="multiple"
        :data="data"
        @drag-sort-end="changeData"
        drag-sort-key="drag"
      >
      </drag-sort-table>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { DragSortTable } from '@/components/drag-sort-table'
import { PageWrapper } from '@/components/page-wrapper'
import { PageCard } from '@/components/page-card'
import { ProTableColumns } from '@/components/pro-table'
import { ref } from 'vue'

const data = ref<any>(
  Array(100)
    .fill(0)
    .map((item, index) => {
      return {
        id: index,
        name: index + 213123
      }
    })
)

const columns: ProTableColumns = [
  {
    title: '拖拽',
    key: 'drag'
  },
  {
    title: '活动名称',
    key: 'name',
    tip: 'tip'
  },

  {
    title: '状态',
    key: 'status',
    rowComponent: {
      el: 'ElInput',
      rules: [{ required: true, message: '状态' }]
    }
  },
  {
    title: '邮箱',
    key: 'email',
    rowComponent: {
      el: 'ElInput',
      rules: [{ required: true, message: '邮箱' }]
    }
  },
  {
    title: '年份',
    key: 'year',
    rowComponent: {
      el: 'ElInput',
      rules: [{ required: true, message: '年份' }]
    }
  },
  {
    title: '进度条',
    key: 'progress',
    // width: 200,
    editable: true,
    valueType: () => {
      return { type: 'progress' }
    },
    rowComponent: {
      el: 'ElInput',
      rules: [{ required: true, message: '进度条' }]
    }
  },

  {
    title: '活动时间',
    key: 'time',
    editable: true,
    rowComponent: {
      el: 'el-date-picker',
      rules: [{ required: true, message: '活动时间' }]
    }
  },
  {
    title: '操作',
    key: 'operation',
    // width: 300,
    fixed: 'right'
  }
]

const changeData = (_d: any) => {
  data.value = _d
}
</script>
<style scoped></style>
