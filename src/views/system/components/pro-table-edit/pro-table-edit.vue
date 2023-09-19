<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <VProTable header-title="pro table" :columns="columns" :data="data" :params="params">
        <template #operation="{ row }">
          <el-button>编辑</el-button>
        </template>
      </VProTable>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { VProTable } from '@/components/pro-table'
import { PageCard, PageWrapper } from '@/components'
import type { ProTableColumns } from '@/components/pro-table'
import { onMounted, ref } from 'vue'

const columns: ProTableColumns = [
  {
    title: '名称',
    key: 'name',
    tip: '测试tip提示',
    fixed: 'left',
    width: 200,
    editable: true
  },

  {
    title: '地址',
    key: 'address',
    width: 200,
    editable: true
  },
  {
    title: '邮箱',
    key: 'email',
    fixed: 'left',
    width: 200,
    editable: true
  },
  {
    title: '年份',
    key: 'year',
    width: 200,
    editable: true
  },
  {
    title: '进度条',
    key: 'progress',
    width: 200,
    editable: true,
    valueType: () => {
      return { type: 'progress' }
    }
  },
  {
    title: '函数式返回 enum',
    key: 'fnE',
    valueType: 'enum',
    width: 200,
    editable: true,
    valueEnum: () => {
      return {
        all: { text: '全部', color: 'blue' },
        open: {
          text: '未解决',
          color: 'green'
        },
        closed: {
          text: '已解决',
          color: 'red'
        },
        processing: {
          text: '解决中',
          color: 'blue'
        }
      }
    }
  },
  {
    title: '状态',
    key: 'status',
    valueType: 'enum',
    width: 200,
    editable: true,

    valueEnum: {
      all: { text: '全部', color: 'blue' },
      open: {
        text: '未解决',
        color: 'green'
      },
      closed: {
        text: '已解决',
        color: 'red'
      },
      processing: {
        text: '解决中',
        color: 'blue'
      }
    }
  },
  {
    title: '地址1',
    key: 'address1',
    width: 200,
    editable: true
  },
  {
    title: '操作',
    key: 'operation',
    width: 200,
    fixed: 'right'
  }
]

const data = ref<any[]>()

onMounted(() => {
  setTimeout(() => {
    data.value = createData()
  }, 0)
})

const params = ref({
  page: 1
})

let i = 0
function createData() {
  let data = Array(100).fill(0)

  let i = 0
  data = data.map((item, index) => {
    return {
      id: ++i,
      name: `name-${index}`,
      age: 18,
      address: `address-${index}`,
      status: 'all',
      fnE: 'open',
      progress: 80
    }
  })

  return data
}
</script>
