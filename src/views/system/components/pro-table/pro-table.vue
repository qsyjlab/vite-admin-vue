<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <el-button :loading="loading">加载</el-button>

      <VProTable
        header-title="pro table"
        :columns="columns"
        :columns-state="{
          persistenceKey: 'test-demo'
        }"
        :data="data"
        :params="params"
        checkable
        :is-pagination="true"
        v-model:loading="loading"
        v-model:selected-keys="selectedKeys"
        @register="register"
        @page-change="pageChange"
      >
        <template #headerTitle> 自定义表头 </template>
        <template #toolbar>
          <el-button type="primary">新增</el-button>
        </template>

        <!-- <template #name="scope"> {{ getScope(scope) }} </template> -->
        <template #operation="{}">
          <el-button size="small" type="primary">编辑</el-button>
          <el-button size="small" type="danger">删除</el-button>
          <el-button size="small">查看</el-button>
        </template>
      </VProTable>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { VProTable, useProTable } from '@/components/pro-table'
import { PageCard, PageWrapper } from '@/components'
import type { ProTableColumns } from '@/components/pro-table'
import { onMounted, ref, watch } from 'vue'

const loading = ref(false)
const selectedKeys = ref<any[]>()

const { register } = useProTable()

watch(loading, () => {
  console.log('v-model:loading', loading)
})

watch(selectedKeys, () => {
  console.log('selectedKeys', selectedKeys.value)
})

setTimeout(() => {
  selectedKeys.value = [5, 6]
}, 3000)

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
    title: '年龄',
    key: 'age',
    width: 200,
    fixed: 'left',
    children: [
      {
        title: '年龄2',
        key: 'age-c',
        children: []
      },
      {
        title: '年龄3',
        key: 'age-c2',
        children: []
      }
    ]
  },
  {
    title: '地址',
    key: 'address',
    width: 200
  },
  {
    title: '邮箱',
    key: 'email',
    fixed: 'left',
    width: 200
  },
  {
    title: '年份',
    key: 'year',
    width: 200
  },
  {
    title: '进度条',
    key: 'progress',
    width: 200,
    valueType: () => {
      return { type: 'progress' }
    }
  },
  {
    title: '函数式返回 enum',
    key: 'fnE',
    valueType: 'enum',
    width: 200,
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
    width: 200
  },
  {
    title: '地址2',
    key: 'address2',
    width: 200
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

watch(data, newVal => {
  // console.log('mewVal', newVal)
})

const params = ref({
  page: 1
})

function pageChange(page: number, size: number) {
  console.log('page', page, size)
}

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
      progress: 80,
      children: [
        {
          id: ++i,
          name: `name-${index}`,
          age: 18,
          address: `address-${index}`,
          status: 'processing'
        },
        {
          id: ++i,
          name: `name-${index}`,
          age: 18,
          address: `address-${index}`,
          status: 'processing'
        }
      ]
    }
  })

  return data
}
</script>
