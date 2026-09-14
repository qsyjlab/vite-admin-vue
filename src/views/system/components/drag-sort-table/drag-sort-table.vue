<template>
  <page-wrapper class="drag-sort-table-page">
    <g-page-header
      title="ProDragSortTable"
      description="按住行拖拽即可调整任务优先级顺序，拖拽结果实时同步到 v-model。"
      :icon="Rank"
    >
      <template #actions>
        <el-tag effect="plain" type="primary">拖拽排序</el-tag>
        <el-tag effect="plain" type="success">实时同步</el-tag>
      </template>
    </g-page-header>

    <pro-card :body-padding="false" class="drag-sort-table-page__table-card">
      <pro-drag-sort-table
        v-model="data"
        class="drag-sort-table-demo"
        :columns="columns"
        row-key="id"
        header-title="任务优先级"
        @drag-sort-end="handleDragSortEnd"
      />
    </pro-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { Rank } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { GPageHeader, PageWrapper } from '@/components'
import {
  ProCard,
  ProDragSortTable,
  type ProDragSortTableEnd,
  type ProTableColumns
} from '@framebase/element-plus-pro-components'

defineOptions({
  name: 'ProDragSortTablePage'
})

interface TaskRecord {
  id: number
  title: string
  owner: string
  priority: 'high' | 'medium' | 'normal'
  status: 'pending' | 'processing' | 'completed'
  deadline: string
}

const priorityValueEnum = {
  high: { text: '高', type: 'danger' },
  medium: { text: '中', type: 'warning' },
  normal: { text: '普通', type: 'info' }
} as const
const statusValueEnum = {
  pending: { text: '待处理', type: 'warning' },
  processing: { text: '进行中', type: 'primary' },
  completed: { text: '已完成', type: 'success' }
} as const

const data = ref<TaskRecord[]>([
  {
    id: 1,
    title: '确认七月营销预算',
    owner: '李娜',
    priority: 'high',
    status: 'processing',
    deadline: '2026-07-12'
  },
  {
    id: 2,
    title: '审核华东区采购申请',
    owner: '张伟',
    priority: 'high',
    status: 'pending',
    deadline: '2026-07-13'
  },
  {
    id: 3,
    title: '整理重点客户续约方案',
    owner: '陈晨',
    priority: 'medium',
    status: 'processing',
    deadline: '2026-07-15'
  },
  {
    id: 4,
    title: '发布服务质量周报',
    owner: '王强',
    priority: 'normal',
    status: 'completed',
    deadline: '2026-07-16'
  }
])

const columns: ProTableColumns<TaskRecord> = [
  { key: 'title', dataIndex: 'title', title: '任务名称', minWidth: 220 },
  { key: 'owner', dataIndex: 'owner', title: '负责人', width: 120 },
  {
    key: 'priority',
    dataIndex: 'priority',
    title: '优先级',
    width: 110,
    valueType: 'status',
    valueEnum: priorityValueEnum
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: '状态',
    width: 120,
    valueType: 'status',
    valueEnum: statusValueEnum
  },
  { key: 'deadline', dataIndex: 'deadline', title: '截止日期', width: 140, valueType: 'date' }
]

function handleDragSortEnd(event: ProDragSortTableEnd<TaskRecord>) {
  ElMessage.success(`${event.row.title} 已移动到第 ${event.newIndex + 1} 位`)
}
</script>

<style scoped lang="scss">
.drag-sort-table-page {
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
    }
  }
}

.drag-sort-table-demo {
  min-height: 0;
  flex: 1 1 auto;
}
</style>
