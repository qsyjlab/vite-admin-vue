<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <pro-table
        ref="tableRef"
        v-model:selected-keys="selectedKeys"
        row-key="id"
        header-title="pro table"
        :columns="columns"
        :request="getTableMockList"
        :params="{
          type: 1
        }"
        checkable
        auto-fit-height
        :reserve-selection="true"
        :pagination="{
          pageSize: 10,
          pageSizes: [10, 20, 40],
          background: true
        }"
        :cache-selected-data="cacheSelectedData"
        @page-change="pageChange"
        @select="selectHandler"
        @select-all="selectAllHandler"
        @selection-change="selectionChangeHandler"
      >
        <template #headerTitle> 自定义表头 </template>
        <template #toolbar>
          <el-button type="primary" @click="tableRef?.doHeight()">新增</el-button>
        </template>

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
import { ProTableInstance } from '@/components/pro-table'
import { PageCard, PageWrapper } from '@/components'
import type { ProTableColumns } from '@/components/pro-table'
import { onMounted, ref, watch } from 'vue'

import { getTableMockList } from '@/api/todos'

defineOptions({
  name: 'ProTablePage'
})

const loading = ref(false)

const cacheSelectedData = ref([{ id: 2 }, { id: 3 }, { id: 15 }])
const selectedKeys = ref<any[]>(cacheSelectedData.value.map(i => i.id))

const tableRef = ref<ProTableInstance>()

onMounted(() => {
  setTimeout(() => {
    data.value = createData()
  }, 0)
})

watch(loading, () => {
  console.log('v-model:loading', loading)
})

watch(selectedKeys, () => {
  console.log('selectedKeys', selectedKeys.value)
})

const columns: ProTableColumns = [
  {
    key: 'indexBorder',
    valueType: 'indexBorder',
    fixed: 'left'
  },
  {
    title: 'ID',
    key: 'id'
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

const pageRef = ref<number>(1)

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

function selectionChangeHandler(selection) {
  console.log('selection', selection)
}

function selectHandler(selection, row) {
  console.log('selection, row', selection, row)
}

function selectAllHandler(selection) {
  console.log('selectAllHandler', selection)
}
</script>
