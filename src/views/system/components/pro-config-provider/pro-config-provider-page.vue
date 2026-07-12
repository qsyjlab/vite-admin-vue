<template>
  <page-wrapper class="pro-config-provider-page">
    <div class="component-page-header">
      <div>
        <h1>ProConfigProvider</h1>
        <p>统一管理 Pro 组件尺寸、局部暗黑、字段默认值和 Teleport 弹层主题。</p>
      </div>
      <div class="component-page-header__actions">
        <el-segmented v-model="size" :options="sizeOptions" />
        <el-switch v-model="dark" inline-prompt active-text="暗" inactive-text="亮" />
      </div>
    </div>

    <pro-config-provider
      :size="size"
      :dark="dark"
      :field="{ emptyText: '暂无数据' }"
      :card="{ shadow: 'never' }"
    >
      <div class="provider-preview">
        <pro-card title="局部配置预览" subtitle="Select 和 DatePicker 弹层会跟随当前局部主题">
          <el-form label-position="left" label-width="92px">
            <el-form-item label="项目成员">
              <pro-select
                v-model="member"
                :options="members"
                placeholder="选择成员"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="交付日期">
              <pro-field
                v-model="deliveryDate"
                mode="edit"
                value-type="date"
                :field-props="{ placeholder: '选择交付日期', style: { width: '100%' } }"
              />
            </el-form-item>
            <el-form-item label="空值展示">
              <pro-field :model-value="undefined" mode="read" />
            </el-form-item>
          </el-form>
        </pro-card>

        <pro-config-provider size="small" :card="{ bordered: false }">
          <pro-card title="嵌套 Provider" subtitle="仅覆盖尺寸和卡片边框，暗黑状态继承父级">
            <div class="nested-preview">
              <el-button type="primary">Small 按钮</el-button>
              <pro-select
                v-model="status"
                :options="statusOptions"
                placeholder="选择状态"
                style="width: 180px"
              />
            </div>
          </pro-card>
        </pro-config-provider>

        <pro-card
          class="provider-table-card"
          title="Teleport 工具栏弹层"
          subtitle="密度菜单和列设置会继承当前局部暗黑主题"
        >
          <pro-table
            header-title="迭代任务"
            :columns="tableColumns"
            :data="tableData"
            :pagination="false"
            row-key="id"
          />
        </pro-card>
      </div>
    </pro-config-provider>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PageWrapper } from '@/components'
import {
  ProCard,
  ProConfigProvider,
  ProField,
  ProSelect,
  ProTable,
  type ProTableColumns
} from '@vite-admin/pro-components'

defineOptions({ name: 'ProConfigProviderPage' })

const dark = ref(false)
const size = ref<'small' | 'default' | 'large'>('default')
const member = ref<number>()
const status = ref<string>()
const deliveryDate = ref<string>()
const sizeOptions = [
  { label: '紧凑', value: 'small' },
  { label: '默认', value: 'default' },
  { label: '宽松', value: 'large' }
]
const members = [
  { label: '陈晨', value: 1 },
  { label: '林涛', value: 2 },
  { label: '周宁', value: 3 }
]
const statusOptions = [
  { label: '进行中', value: 'active' },
  { label: '有风险', value: 'risk' },
  { label: '已完成', value: 'done' }
]

interface TaskRecord {
  id: number
  title: string
  owner: string
  status: string
}

const tableColumns: ProTableColumns<TaskRecord> = [
  { key: 'title', title: '任务', dataIndex: 'title', minWidth: 180 },
  { key: 'owner', title: '负责人', dataIndex: 'owner', width: 100 },
  { key: 'status', title: '状态', dataIndex: 'status', width: 100 }
]
const tableData: TaskRecord[] = [
  { id: 1, title: '完成组件暗色回归', owner: '陈晨', status: '进行中' },
  { id: 2, title: '核对弹层主题变量', owner: '林涛', status: '待确认' }
]
</script>

<style scoped lang="scss">
.pro-config-provider-page {
  min-width: 0;
}

.component-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
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
    align-items: center;
    gap: 12px;
  }
}

.provider-preview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  min-width: 0;
  padding: 16px;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color-page);
}

.nested-preview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.provider-table-card {
  grid-column: 1 / -1;
}

@media (max-width: 760px) {
  .component-page-header {
    align-items: flex-start;
    flex-direction: column;

    &__actions {
      flex-wrap: wrap;
    }
  }

  .provider-preview {
    grid-template-columns: 1fr;
    padding: 12px;
  }
}
</style>
