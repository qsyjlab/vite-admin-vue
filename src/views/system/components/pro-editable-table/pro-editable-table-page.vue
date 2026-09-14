<template>
  <page-wrapper class="pro-editable-table-page">
    <g-page-header
      title="ProEditableTable"
      description="行内编辑、字段校验与保存/删除回调一体化的可编辑表格。"
      :icon="EditPen"
    >
      <template #actions>
        <el-tag effect="plain" type="primary">行内编辑</el-tag>
        <el-tag effect="plain" type="success">字段校验</el-tag>
        <el-tag effect="plain" type="warning">保存/删除</el-tag>
      </template>
    </g-page-header>

    <pro-card :body-padding="false" class="pro-editable-table-page__table-card">
      <pro-editable-table
        ref="editableTableRef"
        v-model="data"
        v-model:selected-keys="selectedKeys"
        class="editable-table-demo"
        :columns="columns"
        :create-row="createRow"
        :on-save="saveRow"
        :on-delete="deleteRow"
        :on-error="showValidationError"
        row-key="id"
        mode="multiple"
        checkable
        @append-error="error => ElMessage.warning(error.message)"
      />
    </pro-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { EditPen } from '@element-plus/icons-vue'
import { ref, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'
import { GPageHeader, PageWrapper } from '@/components'
import {
  ProCard,
  ProEditableTable,
  type ProEditableTableInstance
} from '@framebase/element-plus-pro-components'
import type {
  ProTableColumns,
  ProTableEditableErrors
} from '@framebase/element-plus-pro-components'

defineOptions({
  name: 'ProEditableTablePage'
})

interface ActivityRecord {
  id: number
  name: string
  owner: string
  status: 'planning' | 'running' | 'completed'
  budget: number
  date: string
}

const statusValueEnum = {
  planning: { text: '筹备中', type: 'warning' },
  running: { text: '进行中', type: 'primary' },
  completed: { text: '已完成', type: 'success' }
} as const

const data = ref<ActivityRecord[]>([
  {
    id: 1,
    name: '夏季客户交流会',
    owner: '张伟',
    status: 'running',
    budget: 58000,
    date: '2026-07-18'
  },
  {
    id: 2,
    name: '产品版本发布',
    owner: '李娜',
    status: 'planning',
    budget: 82000,
    date: '2026-07-26'
  }
])
const selectedKeys = ref<Array<string | number>>([])
const editableTableRef =
  useTemplateRef<ProEditableTableInstance<ActivityRecord>>('editableTableRef')

const columns: ProTableColumns<ActivityRecord> = [
  {
    key: 'name',
    dataIndex: 'name',
    title: '活动名称',
    minWidth: 180,
    editable: true,
    editableRules: [{ required: true, message: '请输入活动名称' }]
  },
  {
    key: 'owner',
    dataIndex: 'owner',
    title: '负责人',
    width: 120,
    editable: true,
    editableRules: [{ required: true, message: '请输入负责人' }]
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: '状态',
    width: 130,
    valueType: 'status',
    valueEnum: statusValueEnum,
    editable: true
  },
  {
    key: 'budget',
    dataIndex: 'budget',
    title: '预算',
    width: 150,
    valueType: { type: 'money', currency: 'CNY' },
    editable: true,
    fieldProps: { min: 0 }
  },
  {
    key: 'date',
    dataIndex: 'date',
    title: '活动日期',
    width: 160,
    valueType: 'date',
    editable: true,
    editableRules: [{ required: true, message: '请选择活动日期' }]
  },
  {
    key: 'operation',
    title: '操作',
    width: 180,
    fixed: 'right'
  }
]

function createRow(): ActivityRecord {
  return {
    id: Date.now(),
    name: '',
    owner: '',
    status: 'planning',
    budget: 0,
    date: ''
  }
}

async function saveRow(row: ActivityRecord) {
  await new Promise(resolve => setTimeout(resolve, 200))
  ElMessage.success(`${row.name} 已保存`)
}

async function deleteRow(row: ActivityRecord) {
  ElMessage.success(`${row.name || '新活动'} 已删除`)
}

function showValidationError(errors: ProTableEditableErrors | undefined) {
  const message = errors ? Object.values(errors)[0]?.[0]?.message : undefined
  if (message) ElMessage.error(message)
}
</script>

<style scoped lang="scss">
.pro-editable-table-page {
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

.editable-table-demo {
  min-height: 0;
  flex: 1 1 auto;
  height: 100%;
}
</style>
