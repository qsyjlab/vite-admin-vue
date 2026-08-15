<template>
  <page-wrapper :full="false" class="steps-demo">
    <header class="steps-demo__header">
      <div>
        <h1>Steps Form</h1>
        <p>逐步校验并汇总为一个泛型模型，最终统一执行 transform</p>
      </div>
      <el-button :icon="Refresh" @click="stepsForm.reset()">重新开始</el-button>
    </header>

    <section class="steps-demo__main">
      <pro-steps-form
        ref="stepsRef"
        :steps="steps"
        :initial-values="initialValues"
        :on-finish="publish"
        @update:model-value="value => (currentValues = value)"
        @success="(_, values) => (submittedValues = values)"
      />
    </section>

    <section class="steps-demo__result">
      <div>
        <span>当前聚合数据</span>
        <pre>{{ JSON.stringify(currentValues, null, 2) }}</pre>
      </div>
      <div>
        <span>最终提交数据</span>
        <pre>{{ submittedValues ? JSON.stringify(submittedValues, null, 2) : '尚未提交' }}</pre>
      </div>
    </section>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { PageWrapper } from '@/components'
import {
  ProStepsForm,
  useProStepsForm,
  type ProStepsFormInstance,
  type ProStepsFormStep
} from '@framebase/element-plus-pro-components'

defineOptions({ name: 'ProStepsFormPage' })

interface PublishForm {
  experiment: {
    name: string
    date: string
  }
  migration: {
    types: string[]
    retentionDays: number
  }
  release: {
    strategy: string
    confirmed: boolean
  }
}

const initialValues: PublishForm = {
  experiment: { name: '', date: '' },
  migration: { types: [], retentionDays: 30 },
  release: { strategy: '', confirmed: false }
}
const currentValues = ref<PublishForm>(structuredClone(initialValues))
const submittedValues = ref<PublishForm>()

const steps: ProStepsFormStep<PublishForm>[] = [
  {
    key: 'basic',
    title: '创建实验',
    description: '基础信息',
    formProps: { labelPosition: 'left', labelWidth: 96 },
    fields: [
      {
        key: 'experiment-name',
        name: 'experiment.name',
        label: '实验名称',
        valueType: 'text',
        required: true,
        transform: value => String(value || '').trim()
      },
      {
        key: 'experiment-date',
        name: 'experiment.date',
        label: '计划日期',
        valueType: 'date',
        required: true
      }
    ]
  },
  {
    key: 'migration',
    title: '迁移参数',
    description: '数据范围',
    formProps: { labelPosition: 'left', labelWidth: 96 },
    fields: [
      {
        key: 'migration-types',
        name: 'migration.types',
        label: '迁移类型',
        valueType: 'checkbox',
        required: true,
        options: [
          { label: '结构迁移', value: 'schema' },
          { label: '全量迁移', value: 'full' },
          { label: '增量迁移', value: 'incremental' }
        ]
      },
      {
        key: 'retention-days',
        name: 'migration.retentionDays',
        label: '记录保留天数',
        valueType: 'number',
        fieldProps: { min: 1, max: 365 }
      }
    ]
  },
  {
    key: 'release',
    title: '发布确认',
    description: '策略与确认',
    formProps: { labelPosition: 'left', labelWidth: 96 },
    fields: [
      {
        key: 'release-strategy',
        name: 'release.strategy',
        label: '发布策略',
        valueType: 'select',
        required: true,
        options: [
          { label: '立即发布', value: 'immediate' },
          { label: '灰度发布', value: 'gray' },
          { label: '定时发布', value: 'scheduled' }
        ]
      },
      {
        key: 'release-confirmed',
        name: 'release.confirmed',
        label: '确认发布',
        valueType: 'switch',
        rules: [
          {
            validator: (_rule, value, callback) => {
              if (value === true) callback()
              else callback(new Error('请确认发布'))
            }
          }
        ]
      }
    ]
  }
]

const stepsRef = useTemplateRef<ProStepsFormInstance<PublishForm, PublishForm>>('stepsRef')
const stepsForm = useProStepsForm(stepsRef)

async function publish(values: PublishForm) {
  await new Promise(resolve => window.setTimeout(resolve, 500))
  return values
}
</script>

<style scoped lang="scss">
.steps-demo {
  color: var(--el-text-color-primary);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;

    h1 {
      margin: 0;
      font-size: 22px;
    }

    p {
      margin: 4px 0 0;
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }

  &__main {
    padding: 24px;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
    background: var(--el-bg-color);
  }

  &__result {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 16px;

    > div {
      min-width: 0;
      padding: 16px;
      border: 1px solid var(--el-border-color);
      border-radius: 6px;
      background: var(--el-bg-color);
    }

    span {
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }

    pre {
      min-height: 120px;
      margin: 10px 0 0;
      padding: 12px;
      overflow: auto;
      border-radius: 4px;
      background: var(--el-fill-color-light);
      color: var(--el-text-color-regular);
    }
  }
}

@media (max-width: 700px) {
  .steps-demo__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .steps-demo__main {
    padding: 16px;
  }

  .steps-demo__result {
    grid-template-columns: 1fr;
  }
}
</style>
