<template>
  <page-wrapper :full="false" class="check-card-page">
    <header class="component-page-header">
      <div>
        <h1>ProCheckCard</h1>
        <p>适合套餐、权限和模块选择，支持键盘导航与 Element Plus 表单校验。</p>
      </div>
      <el-tag effect="plain">方向键 / Home / End</el-tag>
    </header>

    <el-form ref="formRef" :model="formModel" :rules="rules" label-position="top">
      <section class="demo-panel">
        <div class="demo-panel__header">
          <div>
            <h2>选择服务套餐</h2>
            <p>单选模式使用 radiogroup 语义。</p>
          </div>
          <el-tag type="success">{{ selectedPlanTitle }}</el-tag>
        </div>
        <el-form-item prop="plan">
          <pro-check-card-group v-model="formModel.plan" :options="planOptions" :columns="3" />
        </el-form-item>
      </section>

      <section class="demo-panel">
        <div class="demo-panel__header">
          <div>
            <h2>开通业务模块</h2>
            <p>多选模式自动跳过禁用和加载中的卡片。</p>
          </div>
          <span>{{ formModel.modules.length }} 个模块</span>
        </div>
        <el-form-item prop="modules">
          <pro-check-card-group
            v-model="formModel.modules"
            :options="moduleOptions"
            multiple
            :columns="4"
          />
        </el-form-item>
      </section>

      <div class="form-actions">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm">保存配置</el-button>
      </div>
    </el-form>
  </page-wrapper>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { PageWrapper } from '@/components'
import { ProCheckCardGroup, type ProCheckCardOption } from '@framebase/element-plus-pro-components'

defineOptions({ name: 'ProCheckCardPage' })

type PlanValue = 'starter' | 'growth' | 'enterprise'
type ModuleValue = 'analytics' | 'automation' | 'audit' | 'ai'

interface CheckCardForm {
  plan?: PlanValue
  modules: ModuleValue[]
}

const formRef = ref<FormInstance>()
const formModel = reactive<CheckCardForm>({ modules: [] })
const rules: FormRules<CheckCardForm> = {
  plan: [{ required: true, message: '请选择服务套餐', trigger: 'change' }],
  modules: [
    {
      type: 'array',
      required: true,
      min: 1,
      message: '至少开通一个业务模块',
      trigger: 'change'
    }
  ]
}

const planOptions: ProCheckCardOption<PlanValue>[] = [
  {
    value: 'starter',
    title: '基础版',
    description: '适合小团队快速启用，包含基础报表与 5 个成员席位。'
  },
  {
    value: 'growth',
    title: '成长版',
    description: '包含自动化流程、高级报表和 30 个成员席位。'
  },
  {
    value: 'enterprise',
    title: '企业版',
    description: '专属部署、审计与组织权限，支持不限成员。'
  }
]

const moduleOptions: ProCheckCardOption<ModuleValue>[] = [
  { value: 'analytics', title: '数据分析', description: '经营指标与自定义看板。' },
  { value: 'automation', title: '流程自动化', description: '审批、通知和任务编排。' },
  { value: 'audit', title: '安全审计', description: '企业版套餐可开通。', disabled: true },
  { value: 'ai', title: 'AI 助手', description: '服务正在初始化。', loading: true }
]

const selectedPlanTitle = computed(
  () => planOptions.find(option => option.value === formModel.plan)?.title ?? '尚未选择'
)

async function submitForm() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (valid) ElMessage.success('套餐配置已保存')
}

function resetForm() {
  formRef.value?.resetFields()
}
</script>

<style scoped lang="scss">
.check-card-page {
  min-width: 0;
}

.component-page-header,
.demo-panel__header,
.form-actions {
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
}

.demo-panel {
  margin-bottom: 16px;
  padding: 20px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color-overlay);

  &__header {
    margin-bottom: 16px;

    h2 {
      margin: 0;
      font-size: 16px;
    }

    p {
      margin: 5px 0 0;
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }

    > span {
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.form-actions {
  justify-content: flex-end;
}

@media (max-width: 760px) {
  .component-page-header,
  .demo-panel__header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
