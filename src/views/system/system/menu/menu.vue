<template>
  <page-wrapper>
    <page-card header="菜单与路由结构" full>
      <ProTable
        :columns="columns"
        :data="dataSource"
        :is-pagination="false"
        :row-key="'name'"
        :loading="loading"
      />
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { PageCard, PageWrapper, ProTable, type ProTableColumns } from '@/components'
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
const loading = ref(true)

getMenuList()
  .then(res => {
    dataSource.value = res.data
  })
  .finally(() => {
    loading.value = false
  })
</script>
<style scoped></style>
