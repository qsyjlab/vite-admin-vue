<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <pro-table
        v-model:selected-keys="selectedKeys"
        header-title="pro table"
        :columns="columns"
        :request="getTableMockList"
        :params="params"
        checkable
        :pagination="{
          page: pageRef,
          pageSize: 10,
          pageSizes: [10, 20, 40],
          background: true
        }"
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
      </pro-table>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { useProTable } from '@/components/pro-table'
import { PageCard, PageWrapper } from '@/components'
import type { ProTableColumns } from '@/components/pro-table'
import { onMounted, ref, watch } from 'vue'

import { getTableMockList } from '@/api/todos'
import { computed } from 'vue'

defineOptions({
  name: 'ProTablePage'
})

const loading = ref(false)
const selectedKeys = ref<any[]>()

const { register } = useProTable()

const height = computed(() => {
  return `${window.innerHeight - 400}px`
})

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
    key: 'indexBorder',
    valueType: 'indexBorder',
    fixed: 'left'
  },
  {
    title: '名称',
    key: 'name',
    tip: '名称的提示',
    editable: true
  },
  {
    title: '进度条',
    key: 'progress',

    valueType: () => {
      return { type: 'progress' }
    }
  },
  {
    title: '函数式返回 enum',
    key: 'fnE',
    valueType: 'enum',
    tip: '使用函数式 enum',

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
    title: '图片',
    key: 'imageSrc',
    valueType: 'image',
    tip: '渲染图片',
    width: 150
  },
  {
    title: '状态',
    key: 'status',
    valueType: 'enum',
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
    title: '自定义渲染器',
    key: 'customText',
    valueType: 'custom-text'
  },
  {
    title: '自定义渲染器渲染组件',
    key: 'customRenderComponent',
    valueType: 'custom-render-componet'
  },
  {
    title: '操作',
    key: 'operation',
    width: 200,
    fixed: 'right'
  }
]

const data = ref<any[]>()

const pageRef = ref<number>(3)

onMounted(() => {
  setTimeout(() => {
    data.value = createData()
  }, 0)
})

const params = ref({
  page: 1
})

function pageChange(page: number) {
  pageRef.value = page
}

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
