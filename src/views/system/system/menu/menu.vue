<template>
  <page-wrapper class="menu-manage-page">
    <g-page-header
      title="菜单管理"
      description="查看当前登录用户可见的菜单与路由结构，数据来自动态路由注册结果。"
      :icon="MenuIcon"
    >
      <template #actions>
        <el-tag effect="plain" type="primary">树形结构</el-tag>
        <el-tag effect="plain" type="success">实时加载</el-tag>
      </template>
    </g-page-header>

    <pro-card :body-padding="false" class="menu-manage-page__table-card">
      <ProTable
        :columns="columns"
        :data="dataSource"
        :pagination="false"
        :row-key="'name'"
        :loading="loading"
      />
    </pro-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { Menu as MenuIcon } from '@element-plus/icons-vue'
import { GPageHeader, PageWrapper } from '@/components'
import { ProCard, ProTable, type ProTableColumns } from '@framebase/element-plus-pro-components'
import { getMenuList } from '@/api/permission'
import { ref } from 'vue'

const columns: ProTableColumns<Record<string, unknown>> = [
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
<style scoped lang="scss">
.menu-manage-page {
  gap: 16px;

  &__table-card {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;

    :deep(.pro-card__body) {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      min-height: 0;
      overflow: auto;
    }
  }
}
</style>
