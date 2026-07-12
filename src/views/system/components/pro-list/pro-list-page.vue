<template>
  <page-wrapper class="pro-list-page">
    <div class="component-page-header">
      <div>
        <h1>ProList</h1>
        <p>用于任务、项目和消息等非表格记录，支持请求、分页、选择与网格布局。</p>
      </div>
      <div class="component-page-header__actions">
        <el-segmented v-model="dataMode" :options="dataModeOptions" />
        <el-segmented v-model="layout" :options="layoutOptions" />
      </div>
    </div>

    <div class="list-toolbar">
      <span>已选择 {{ selectedKeys.length }} 项</span>
      <div>
        <el-button :disabled="!selectedKeys.length" @click="clearSelection">清空选择</el-button>
        <el-button :icon="RefreshRight" @click="reload">重新加载</el-button>
      </div>
    </div>

    <pro-list
      ref="listRef"
      v-model:selected-keys="selectedKeys"
      :request="getTaskPage"
      :item-meta="{ title: 'title', description: 'description' }"
      :layout="layout"
      :grid-columns="{ xs: 1, sm: 2, xl: 3 }"
      :pagination="{ pageSize: 4, pageSizes: [4, 8] }"
      row-key="id"
      selectable
      reserve-selection
    >
      <template #content="{ record }">
        <div class="task-meta">
          <el-tag :type="getTask(record).type" effect="plain">{{ getTask(record).status }}</el-tag>
          <span>{{ getTask(record).owner }}</span>
          <span>{{ getTask(record).dueAt }}</span>
        </div>
      </template>
      <template #actions="{ record }">
        <el-button link type="primary" @click="showTask(record)">查看</el-button>
      </template>
    </pro-list>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { RefreshRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { PageWrapper } from '@/components'
import {
  ProList,
  useProList,
  type ProListInstance,
  type ProListRequestParams,
  type ProListRequestResult
} from '@vite-admin/pro-components'

defineOptions({ name: 'ProListPage' })

interface TaskRecord {
  id: number
  title: string
  description: string
  owner: string
  dueAt: string
  status: string
  type: 'success' | 'warning' | 'danger' | 'info'
}

const tasks: TaskRecord[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: ['确认需求范围', '完成接口联调', '修复验收问题', '准备发布清单'][index % 4],
  description: `任务编号 TASK-${String(index + 1).padStart(3, '0')}，记录当前迭代的交付事项。`,
  owner: ['陈晨', '林涛', '周宁'][index % 3],
  dueAt: `${index + 12}:30`,
  status: ['进行中', '待确认', '有风险', '已完成'][index % 4],
  type: ['success', 'warning', 'danger', 'info'][index % 4] as TaskRecord['type']
}))
const layout = ref<'list' | 'grid'>('list')
const dataMode = ref<'data' | 'empty'>('data')
const selectedKeys = ref<Array<string | number>>([])
const dataModeOptions = [
  { label: '数据', value: 'data' },
  { label: '空状态', value: 'empty' }
]
const layoutOptions = [
  { label: '列表', value: 'list' },
  { label: '网格', value: 'grid' }
]
const listRef = useTemplateRef<ProListInstance<TaskRecord>>('listRef')
const list = useProList(listRef)

async function getTaskPage(
  params: ProListRequestParams<Record<string, never>>
): Promise<ProListRequestResult<TaskRecord>> {
  await new Promise(resolve => window.setTimeout(resolve, 220))
  if (dataMode.value === 'empty') return { data: [], total: 0 }
  const start = (params.current - 1) * params.pageSize
  return { data: tasks.slice(start, start + params.pageSize), total: tasks.length }
}

function getTask(record: Record<string, unknown>) {
  return record as unknown as TaskRecord
}

async function reload() {
  await list.reload(false)
  ElMessage.success('列表已重新加载')
}

async function clearSelection() {
  await list.clearSelection()
}

watch(dataMode, async () => {
  await list.clearSelection()
  await list.reload()
})

function showTask(record: Record<string, unknown>) {
  ElMessage.info(getTask(record).title)
}
</script>

<style scoped lang="scss">
.pro-list-page {
  min-width: 0;
}

.component-page-header,
.list-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

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

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}

.list-toolbar {
  padding: 12px 16px;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-light);
  border-bottom: 0;

  > div {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
}

@media (max-width: 640px) {
  .component-page-header,
  .list-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
