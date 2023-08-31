<template>
  <div>
    <VProTable :columns="columns" :data="dataSource" :is-pagination="false" :row-key="'name'" />
  </div>
</template>
<script setup lang="ts">
import { VProTable, ProTableColumns } from '@/components/pro-table'
import { getMenuList } from '@/api/permission'
import { ref } from 'vue'

const columns: ProTableColumns = [
  {
    title: '菜单名称',
    key: 'meta.title'
  },
  {
    title: '路由 name',
    key: 'name'
  },
  {
    title: '路由 path',
    key: 'path'
  },
  {
    title: '权限 key',
    key: 'code'
  },
  /**
  // TODO: el-table 如果 列拿到的值是 object
   * Invalid VNode type: undefined (undefined)
   */
  {
    title: 'redirect',
    key: 'redirect'
  },
  {
    title: '排序',
    key: 'meta.sort',
    tip: '排序只对同级节点生效'
  }
]

const dataSource = ref<any>()

getMenuList().then(res => {
  dataSource.value = res.data

  console.log('dataSource.value ', dataSource.value)
})
</script>
<style scoped></style>
