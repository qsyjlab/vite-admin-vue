<template>
  <page-wrapper class="pro-card-page">
    <div class="component-page-header">
      <div>
        <h1>ProCard / ProStatisticCard</h1>
        <p>覆盖业务分组、响应式网格、加载、受控折叠和统计指标。</p>
      </div>
      <el-switch v-model="loading" inline-prompt active-text="加载" inactive-text="就绪" />
    </div>

    <div class="statistic-grid">
      <pro-statistic-card
        title="本月收入"
        :value="286.4"
        :precision="1"
        prefix="¥"
        suffix="万"
        trend="up"
        trend-value="14.2%"
        description="较上月增加 35.6 万"
        :loading="loading"
      />
      <pro-statistic-card
        title="活跃客户"
        :value="1286"
        suffix="家"
        trend="up"
        trend-value="8.6%"
        description="新增客户 94 家"
        :loading="loading"
      />
      <pro-statistic-card
        title="逾期任务"
        :value="18"
        suffix="项"
        trend="down"
        trend-value="5"
        description="风险持续下降"
        :loading="loading"
      />
    </div>

    <pro-card
      ref="deliveryCardRef"
      v-model:collapsed="collapsed"
      title="交付阶段"
      subtitle="受控折叠状态与响应式列数"
      collapsible
      header-bordered
      split
      :columns="{ xs: 1, sm: 2, lg: 4 }"
      :body-padding="false"
      :loading="loading"
    >
      <template #extra>
        <el-button link type="primary" @click="toggleCard">{{
          collapsed ? '展开内容' : '收起内容'
        }}</el-button>
      </template>
      <div v-for="stage in stages" :key="stage.name" class="stage-item">
        <span>{{ stage.name }}</span>
        <strong>{{ stage.value }}</strong>
        <el-progress :percentage="stage.progress" :stroke-width="6" :show-text="false" />
      </div>
    </pro-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { PageWrapper } from '@/components'
import {
  ProCard,
  ProStatisticCard,
  useProCard,
  type ProCardInstance
} from '@vite-admin/pro-components'

defineOptions({ name: 'ProCardPage' })

const loading = ref(false)
const collapsed = ref(false)
const deliveryCardRef = useTemplateRef<ProCardInstance>('deliveryCardRef')
const deliveryCard = useProCard(deliveryCardRef)
const stages = [
  { name: '需求确认', value: 24, progress: 92 },
  { name: '开发中', value: 38, progress: 68 },
  { name: '测试中', value: 17, progress: 46 },
  { name: '待发布', value: 9, progress: 25 }
]

async function toggleCard() {
  await deliveryCard.toggleCollapse()
}
</script>

<style scoped lang="scss">
.pro-card-page {
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
}

.statistic-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.stage-item {
  display: grid;
  gap: 10px;
  min-width: 0;

  span {
    color: var(--el-text-color-secondary);
  }

  strong {
    font-size: 26px;
  }
}

@media (max-width: 760px) {
  .component-page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .statistic-grid {
    grid-template-columns: 1fr;
  }
}
</style>
