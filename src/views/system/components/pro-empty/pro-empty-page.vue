<template>
  <page-wrapper class="pro-empty-page">
    <div class="component-page-header">
      <div>
        <h1>ProEmpty</h1>
        <p>统一空数据、搜索无结果、请求失败和无权限状态。</p>
      </div>
    </div>

    <div class="empty-grid">
      <section v-for="item in statuses" :key="item.status" class="empty-panel">
        <pro-empty
          :status="item.status"
          :title="item.title"
          :action-text="item.actionText"
          compact
          @action="handleAction(item.status)"
        />
      </section>
    </div>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { PageWrapper } from '@/components'
import { ProEmpty, type ProEmptyStatus } from '@framebase/element-plus-pro-components'

defineOptions({ name: 'ProEmptyPage' })

const statuses: Array<{ status: ProEmptyStatus; title: string; actionText?: string }> = [
  { status: 'empty', title: '还没有创建项目', actionText: '新建项目' },
  { status: 'search', title: '没有符合条件的记录', actionText: '清空筛选' },
  { status: 'error', title: '订单数据加载失败', actionText: '重新加载' },
  { status: 'forbidden', title: '你没有查看财务数据的权限', actionText: '申请权限' }
]

function handleAction(status: ProEmptyStatus) {
  ElMessage.success(`触发 ${status} 状态操作`)
}
</script>

<style scoped lang="scss">
.component-page-header {
  margin-bottom: 18px;

  h1 {
    margin: 0;
    font-size: 24px;
  }

  p {
    margin: 6px 0 0;
    color: var(--el-text-color-secondary);
  }
}

.empty-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.empty-panel {
  min-width: 0;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color-overlay);
}

@media (max-width: 760px) {
  .empty-grid {
    grid-template-columns: 1fr;
  }
}
</style>
