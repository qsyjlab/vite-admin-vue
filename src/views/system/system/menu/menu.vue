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
  {
    title: 'redirect',
    key: 'redirectText'
  },
  {
    title: '排序',
    key: 'order',
    tip: '排序只对同级节点生效'
  }
]

interface MenuNode {
  name?: string
  redirect?: unknown
  children?: MenuNode[]
  meta?: Record<string, unknown>
  [key: string]: unknown
}

/** redirect 可能是 string / { name } / { path }，表格里统一显示为字符串 */
function formatRedirect(redirect: unknown): string {
  if (!redirect) return '-'
  if (typeof redirect === 'string') return redirect
  if (typeof redirect === 'object') {
    const target = redirect as { name?: string; path?: string }
    return target.name ?? target.path ?? '-'
  }
  return String(redirect)
}

/** 为表格展示补充展平字段（redirectText/order），保留树形结构 */
function normalizeForDisplay(nodes: MenuNode[]): MenuNode[] {
  return nodes.map(node => ({
    ...node,
    redirectText: formatRedirect(node.redirect),
    order: (node.meta?.order as number | undefined) ?? '-',
    children: node.children?.length ? normalizeForDisplay(node.children) : undefined
  }))
}

const dataSource = ref<MenuNode[]>([])
const loading = ref(true)

getMenuList()
  .then(res => {
    dataSource.value = normalizeForDisplay((res.data || []) as MenuNode[])
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
