<template>
  <page-wrapper :full="false" class="result-page">
    <header class="component-page-header">
      <div>
        <h1>ProResult</h1>
        <p>用于提交反馈、权限提示和系统异常，操作区保持一致。</p>
      </div>
      <el-radio-group v-model="activeScenario" size="small">
        <el-radio-button v-for="scenario in scenarios" :key="scenario.key" :value="scenario.key">
          {{ scenario.label }}
        </el-radio-button>
      </el-radio-group>
    </header>

    <section class="result-panel">
      <pro-result
        :status="currentScenario.status"
        :title="currentScenario.title"
        :sub-title="currentScenario.subTitle"
        :primary-text="currentScenario.primaryText"
        :secondary-text="currentScenario.secondaryText"
        @primary="handlePrimary"
        @secondary="handleSecondary"
      >
        <dl class="result-detail">
          <template v-for="item in currentScenario.details" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </template>
        </dl>
      </pro-result>
    </section>
  </page-wrapper>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { PageWrapper } from '@/components'
import { ProResult, type ProResultStatus } from '@framebase/element-plus-pro-components'

defineOptions({ name: 'ProResultPage' })

interface ResultScenario {
  key: string
  label: string
  status: ProResultStatus
  title: string
  subTitle: string
  primaryText: string
  secondaryText?: string
  details: Array<{ label: string; value: string }>
}

const scenarios: ResultScenario[] = [
  {
    key: 'publish',
    label: '发布成功',
    status: 'success',
    title: '内容发布成功',
    subTitle: '文章已进入内容中心，预计 1 分钟内完成全站同步。',
    primaryText: '查看内容',
    secondaryText: '继续创建',
    details: [
      { label: '内容编号', value: 'CONTENT-2026-0714' },
      { label: '发布渠道', value: '官网 / 移动端 / 企业微信' },
      { label: '操作人员', value: '管理员' }
    ]
  },
  {
    key: 'permission',
    label: '权限不足',
    status: '403',
    title: '暂无财务数据权限',
    subTitle: '当前账号未加入财务分析角色，请联系组织管理员授权。',
    primaryText: '申请权限',
    secondaryText: '返回工作台',
    details: [
      { label: '所需角色', value: '财务分析员' },
      { label: '资源范围', value: '经营分析 / 回款预测' },
      { label: '申请时效', value: '通常在 1 个工作日内处理' }
    ]
  },
  {
    key: 'service',
    label: '服务异常',
    status: '500',
    title: '报表生成失败',
    subTitle: '服务暂时不可用，原始数据和查询条件已安全保留。',
    primaryText: '重新生成',
    secondaryText: '下载原始数据',
    details: [
      { label: '请求编号', value: 'REQ-F8A21C' },
      { label: '失败时间', value: '2026-07-14 14:32:18' },
      { label: '建议操作', value: '稍后重试或联系技术支持' }
    ]
  }
]

const activeScenario = ref('publish')
const currentScenario = computed(
  () => scenarios.find(scenario => scenario.key === activeScenario.value) ?? scenarios[0]!
)

function handlePrimary() {
  ElMessage.success(`触发操作：${currentScenario.value.primaryText}`)
}

function handleSecondary() {
  ElMessage.info(`触发操作：${currentScenario.value.secondaryText}`)
}
</script>

<style scoped lang="scss">
.result-page {
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

.result-panel {
  min-height: 520px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color-overlay);
}

.result-detail {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 12px 20px;
  margin: 0;

  dt {
    color: var(--el-text-color-secondary);
  }

  dd {
    min-width: 0;
    margin: 0;
    color: var(--el-text-color-primary);
    overflow-wrap: anywhere;
  }
}

@media (max-width: 760px) {
  .component-page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .component-page-header :deep(.el-radio-group) {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .component-page-header :deep(.el-radio-button__inner) {
    width: 100%;
  }

  .result-panel {
    min-height: 0;
  }

  .result-detail {
    grid-template-columns: 1fr;
    gap: 5px;

    dd + dt {
      margin-top: 8px;
    }
  }
}
</style>
