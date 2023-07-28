<template>
  <el-card :header="$route.meta.title">
    <VProTable
      header-title="pro table"
      :columns="columns"
      :data="data"
      :params="params"
      checkable
      :is-pagination="true"
      @page-change="pageChange"
    >
      <!-- <template #name="scope"> {{ getScope(scope) }} </template> -->
      <template #operation>
        <el-button size="small" type="primary">编辑</el-button>
        <el-button size="small" type="danger">删除</el-button>
        <el-button size="small">查看</el-button>
      </template>
    </VProTable>
  </el-card>
</template>
<script setup lang="ts">
import { VProTable } from '@/components/pro-table'
import { onMounted, ref, watch } from 'vue'

// function getScope(sc) {
//   console.log('sc', sc)
// }

const columns = [
  {
    title: '名称',
    key: 'name',
    fixed: 'left'
    // renderHeader: () => {
    //   return <>测试 tsx</>
    // }
  },
  {
    title: '年龄',
    key: 'age',
    // fixed: 'left',
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
    key: 'address'
  },
  {
    title: '邮箱',
    key: 'email',
    fixed: 'left'
  },
  {
    title: '年份',
    key: 'year'
  },
  {
    title: '身份证',
    key: 'idcard'
  },
  {
    title: '状态',
    key: 'status'
  },
  {
    title: '地址1',
    key: 'address1'
  },
  {
    title: '地址2',
    key: 'address2'
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
  }, 1000)
})

watch(data, newVal => {
  console.log('mewVal', newVal)
})
console.log('change layout')

const params = ref({
  page: 1
})

function pageChange(page: number, size: number) {
  console.log('page', page, size)
}

function createData() {
  let data = Array(100).fill(0)

  let i = 0
  data = data.map((item, index) => {
    return {
      id: i++,
      name: `name-${index}`,
      age: 18,
      address: `address-${index}`,
      children: [
        {
          id: i++,
          name: `name-${index}`,
          age: 18,
          address: `address-${index}`
        },
        {
          id: i++,
          name: `name-${index}`,
          age: 18,
          address: `address-${index}`
        }
      ]
    }
  })

  return data
}
</script>
