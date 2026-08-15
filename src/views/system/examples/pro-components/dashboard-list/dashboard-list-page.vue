<template>
  <page-wrapper class="dashboard-list-page">
    <pro-config-provider
      :dark="localDark"
      :size="componentSize"
      :theme="{ variables: { '--workspace-accent': accentColor } }"
      :card="{ bordered: true, shadow: 'never' }"
      :list="{ bordered: true, emptyText: '没有符合条件的项目' }"
    >
      <div class="dashboard-list-page__surface">
        <header class="dashboard-list-page__header">
          <div>
            <h1>项目运营工作台</h1>
            <p>跟踪项目交付、风险和待办进展</p>
          </div>
          <div class="dashboard-list-page__controls">
            <el-segmented v-model="componentSize" :options="sizeOptions" />
            <el-switch v-model="localDark" inline-prompt active-text="暗" inactive-text="亮" />
          </div>
        </header>

        <div class="dashboard-list-page__statistics">
          <pro-statistic-card
            title="进行中项目"
            :value="7"
            suffix="个"
            trend="up"
            trend-value="12%"
            description="较上周新增 2 个"
          />
          <pro-statistic-card
            title="本周完成任务"
            :value="128"
            suffix="项"
            trend="up"
            trend-value="18%"
            description="团队交付保持稳定"
          />
          <pro-statistic-card
            title="风险事项"
            :value="9"
            suffix="项"
            trend="down"
            trend-value="3"
            description="3 项已完成降级"
          />
          <pro-statistic-card
            title="按期交付率"
            :value="92.6"
            :precision="1"
            suffix="%"
            trend="up"
            trend-value="2.4%"
            description="高于季度目标"
          />
        </div>

        <pro-card
          ref="overviewCardRef"
          title="本周交付概览"
          subtitle="按工作流阶段汇总当前任务"
          collapsible
          header-bordered
          split
          :columns="{ xs: 2, md: 4 }"
          :body-padding="false"
        >
          <template #extra>
            <el-button link type="primary" @click="toggleOverview">切换折叠</el-button>
          </template>
          <div v-for="item in deliveryOverview" :key="item.label" class="delivery-overview-item">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
            <small>{{ item.note }}</small>
          </div>
        </pro-card>

        <div class="dashboard-list-page__main">
          <pro-card
            title="重点项目"
            subtitle="支持远程分页、跨页选择和错误重试"
            :body-padding="false"
          >
            <template #extra>
              <el-segmented v-model="listLayout" :options="layoutOptions" />
            </template>
            <div class="project-toolbar">
              <span>已选择 {{ selectedKeys.length }} 个项目</span>
              <div>
                <el-button :disabled="!selectedKeys.length" @click="clearSelected"
                  >清空选择</el-button
                >
                <el-button :icon="RefreshRight" :disabled="projectLoading" @click="refreshProjects">
                  刷新
                </el-button>
                <el-button
                  :type="failNextRequest ? 'danger' : 'default'"
                  :disabled="projectLoading"
                  @click="simulateRequestFailure"
                  >模拟失败</el-button
                >
              </div>
            </div>
            <pro-list
              ref="projectListRef"
              v-model:selected-keys="selectedKeys"
              :request="getProjectPage"
              :item-meta="{ title: 'name', description: 'summary' }"
              :layout="listLayout"
              :grid-columns="{ xs: 1, sm: 2 }"
              :pagination="{ pageSize: 4, pageSizes: [4, 8, 12] }"
              row-key="id"
              selectable
              reserve-selection
              @loading-change="projectLoading = $event"
              @request-error="handleRequestError"
            >
              <template #content="{ record }">
                <div class="project-meta">
                  <el-tag :type="getProjectStatus(record).type" effect="light">
                    {{ getProjectStatus(record).text }}
                  </el-tag>
                  <span>{{ record.department }}</span>
                  <span>负责人 {{ record.owner }}</span>
                  <span>{{ record.tasks }} 项任务</span>
                </div>
                <el-progress :percentage="getProjectRecord(record).progress" :stroke-width="6" />
              </template>
              <template #actions="{ record }">
                <el-button link type="primary" @click="showProject(record)">查看</el-button>
              </template>
            </pro-list>
          </pro-card>

          <pro-card title="今日待办" subtitle="优先处理阻塞交付的事项" header-bordered>
            <div class="todo-list">
              <label v-for="todo in todos" :key="todo.id" class="todo-item">
                <el-checkbox v-model="todo.done" />
                <span :class="{ 'is-done': todo.done }">{{ todo.title }}</span>
                <el-tag size="small" :type="todo.type" effect="plain">{{ todo.time }}</el-tag>
              </label>
            </div>
          </pro-card>
        </div>
      </div>
    </pro-config-provider>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { RefreshRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { PageWrapper } from '@/components'
import {
  ProCard,
  ProConfigProvider,
  ProList,
  ProStatisticCard,
  useProCard,
  useProList,
  type ProCardInstance,
  type ProListInstance,
  type ProListRequestParams,
  type ProListRequestResult
} from '@framebase/element-plus-pro-components'
import { projectRecords, projectStatusMap, type ProjectRecord } from './project-data'

defineOptions({ name: 'DashboardListPage' })

type ComponentSize = 'small' | 'default' | 'large'

const localDark = ref(false)
const componentSize = ref<ComponentSize>('default')
const listLayout = ref<'list' | 'grid'>('list')
const selectedKeys = ref<Array<string | number>>([])
const failNextRequest = ref(false)
const projectLoading = ref(false)
const accentColor = '#409eff'
const sizeOptions = [
  { label: '紧凑', value: 'small' },
  { label: '默认', value: 'default' },
  { label: '宽松', value: 'large' }
]
const layoutOptions = [
  { label: '列表', value: 'list' },
  { label: '网格', value: 'grid' }
]
const deliveryOverview = [
  { label: '需求确认', value: 24, note: '3 项待补充' },
  { label: '开发中', value: 38, note: '6 项今日到期' },
  { label: '测试中', value: 17, note: '通过率 94%' },
  { label: '待发布', value: 9, note: '2 项需审批' }
]
const todos = ref([
  {
    id: 1,
    title: '确认供应链预警规则的验收口径',
    time: '11:30',
    type: 'danger' as const,
    done: false
  },
  {
    id: 2,
    title: '评审客户标签数据质量报告',
    time: '14:00',
    type: 'warning' as const,
    done: false
  },
  { id: 3, title: '同步移动审批灰度反馈', time: '16:30', type: 'info' as const, done: true },
  { id: 4, title: '准备周度项目风险复盘', time: '18:00', type: 'warning' as const, done: false }
])

const overviewCardRef = useTemplateRef<ProCardInstance>('overviewCardRef')
const overviewCard = useProCard(overviewCardRef)
const projectListRef = useTemplateRef<ProListInstance<ProjectRecord>>('projectListRef')
const projectList = useProList(projectListRef)

async function getProjectPage(
  params: ProListRequestParams<Record<string, never>>
): Promise<ProListRequestResult<ProjectRecord>> {
  await new Promise(resolve => window.setTimeout(resolve, 280))
  if (failNextRequest.value) {
    failNextRequest.value = false
    throw new Error('模拟服务暂时不可用，请点击重新加载')
  }
  const start = (params.current - 1) * params.pageSize
  return {
    data: projectRecords.slice(start, start + params.pageSize),
    total: projectRecords.length
  }
}

async function toggleOverview() {
  await overviewCard.toggleCollapse()
}

async function refreshProjects() {
  try {
    await projectList.refresh()
    ElMessage.success('项目列表已刷新')
  } catch {
    // ProList owns the visible error and retry state.
  }
}

async function simulateRequestFailure() {
  failNextRequest.value = true
  await refreshProjects()
}

async function clearSelected() {
  await projectList.clearSelection()
}

function handleRequestError(error: unknown) {
  ElMessage.error(error instanceof Error ? error.message : '项目加载失败')
}

function getProjectRecord(record: Record<string, unknown>) {
  return record as unknown as ProjectRecord
}

function getProjectStatus(record: Record<string, unknown>) {
  return projectStatusMap[getProjectRecord(record).status]
}

function showProject(record: Record<string, unknown>) {
  const project = getProjectRecord(record)
  ElMessage.info(`${project.name}：${project.progress}%`)
}
</script>

<style scoped lang="scss">
.dashboard-list-page {
  min-width: 0;

  &__surface {
    min-width: 0;
    min-height: 100%;
    padding: 20px;
    color: var(--el-text-color-primary);
    background: var(--el-bg-color-page);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 18px;

    h1 {
      margin: 0;
      font-size: 24px;
      letter-spacing: 0;
    }

    p {
      margin: 6px 0 0;
      color: var(--el-text-color-secondary);
    }
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__statistics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }

  &__main {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
    gap: 16px;
    margin-top: 16px;
    align-items: start;
  }
}

.delivery-overview-item {
  display: grid;
  gap: 6px;
  min-width: 0;

  span,
  small {
    color: var(--el-text-color-secondary);
  }

  strong {
    font-size: 24px;
  }
}

.project-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-light);

  > div {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-bottom: 12px;
}

.todo-list {
  display: grid;
  gap: 4px;
}

.todo-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 10px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:last-child {
    border-bottom: 0;
  }

  span {
    overflow-wrap: anywhere;

    &.is-done {
      color: var(--el-text-color-placeholder);
      text-decoration: line-through;
    }
  }
}

@media (max-width: 1100px) {
  .dashboard-list-page__statistics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-list-page__main {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .dashboard-list-page__surface {
    padding: 12px;
  }

  .dashboard-list-page__header,
  .project-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .dashboard-list-page__controls {
    width: 100%;
    flex-wrap: wrap;
  }

  .dashboard-list-page__statistics {
    grid-template-columns: 1fr;
  }
}
</style>
