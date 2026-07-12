<template>
  <page-wrapper :full="false" class="pro-field-demo">
    <header class="pro-field-demo__header">
      <div>
        <h1>ProField</h1>
        <p>统一字段读写、值枚举与 schema 表单渲染</p>
      </div>
      <el-segmented v-model="fieldMode" :options="modeOptions" />
    </header>

    <section class="field-section">
      <div class="field-section__heading">
        <div>
          <h2>字段读写</h2>
          <p>同一份值在 read / edit 模式间切换</p>
        </div>
        <el-button :icon="Aim" @click="field.focus()">聚焦部门字段</el-button>
      </div>

      <div class="field-grid">
        <div v-for="item in fieldExamples" :key="item.key" class="field-item">
          <span class="field-item__label">{{ item.label }}</span>
          <pro-field
            v-if="item.key === 'department'"
            ref="departmentRef"
            v-model="profile.department"
            :mode="fieldMode"
            value-type="select"
            :options="departmentOptions"
            clearable
          />
          <pro-field
            v-else-if="item.key === 'budget'"
            v-model="profile.budget"
            :mode="fieldMode"
            :value-type="{ type: 'money', currency: 'CNY' }"
          />
          <pro-field
            v-else-if="item.key === 'status'"
            v-model="profile.status"
            :mode="fieldMode"
            value-type="status"
            :value-enum="statusEnum"
          />
          <pro-field
            v-else-if="item.key === 'progress'"
            v-model="profile.progress"
            :mode="fieldMode"
            value-type="progress"
            :field-props="{ strokeWidth: 10 }"
          />
          <pro-field v-else v-model="profile.score" :mode="fieldMode" value-type="score" />
        </div>
      </div>
    </section>

    <section class="field-section">
      <div class="field-section__heading">
        <div>
          <h2>Schema 表单集成</h2>
          <p>key 负责稳定渲染，name 负责嵌套数据路径</p>
        </div>
        <div class="field-section__actions">
          <el-button @click="form.resetFields()">重置</el-button>
          <el-button type="primary" @click="submitForm">校验并读取</el-button>
        </div>
      </div>

      <pro-form
        ref="formRef"
        :model="initialForm"
        :fields="formFields"
        :label-width="96"
        enable-effect
        @effect="value => (formSnapshot = value as ProfileForm)"
      />

      <div class="model-preview">
        <span>当前模型</span>
        <code>{{ JSON.stringify(formSnapshot, null, 2) }}</code>
      </div>
    </section>
  </page-wrapper>
</template>

<script setup lang="ts">
import { defineComponent, h, onBeforeUnmount, ref, useTemplateRef } from 'vue'
import { Aim } from '@element-plus/icons-vue'
import { ElRate } from 'element-plus'
import { PageWrapper } from '@/components'
import {
  ProForm,
  useProForm,
  type FormMethodsType,
  type FormSchema,
  ProField,
  registerProField,
  unregisterProField,
  useProField,
  type ProFieldInstance,
  type ProFieldMode,
  type ProFieldValueEnum
} from '@vite-admin/pro-components'

defineOptions({ name: 'ProFieldPage' })

interface ProfileForm {
  profile: {
    name: string
    department?: string
    budget?: number
    active: boolean
  }
}

const departmentOptions = [
  { label: '产品研发部', value: 'product' },
  { label: '平台技术部', value: 'platform' },
  { label: '客户成功部', value: 'success' }
]

const statusEnum: ProFieldValueEnum = {
  pending: { text: '待处理', type: 'warning' },
  active: { text: '进行中', type: 'primary' },
  done: { text: '已完成', type: 'success' }
}

const modeOptions: Array<{ label: string; value: ProFieldMode }> = [
  { label: '读取', value: 'read' },
  { label: '编辑', value: 'edit' }
]
const fieldExamples = [
  { key: 'department', label: '部门' },
  { key: 'budget', label: '项目预算' },
  { key: 'status', label: '执行状态' },
  { key: 'progress', label: '完成进度' },
  { key: 'score', label: '服务评分' }
]

const fieldMode = ref<ProFieldMode>('read')
const profile = ref({
  department: 'platform',
  budget: 128000,
  status: 'active',
  progress: 68,
  score: 4
})

const ScoreRead = defineComponent({
  props: { value: Number },
  setup: props => () => h(ElRate, { modelValue: props.value, disabled: true })
})

registerProField('score', { read: ScoreRead, edit: ElRate })
onBeforeUnmount(() => unregisterProField('score'))

const departmentRef = useTemplateRef<ProFieldInstance<string>>('departmentRef')
const field = useProField(departmentRef)

const initialForm: ProfileForm = {
  profile: {
    name: '企业中台升级',
    department: 'platform',
    budget: 360000,
    active: true
  }
}
const formSnapshot = ref<ProfileForm>(structuredClone(initialForm))

const formFields: FormSchema<ProfileForm>[] = [
  {
    key: 'project-name',
    name: 'profile.name',
    label: '项目名称',
    valueType: 'text',
    required: true,
    col: { span: 12 }
  },
  {
    key: 'project-department',
    name: ['profile', 'department'],
    label: '负责部门',
    valueType: 'select',
    options: departmentOptions,
    required: true,
    col: { span: 12 }
  },
  {
    key: 'project-budget',
    name: 'profile.budget',
    label: '项目预算',
    valueType: { type: 'money', currency: 'CNY' },
    fieldProps: { min: 0, step: 10000 },
    col: { span: 12 }
  },
  {
    key: 'project-active',
    name: 'profile.active',
    label: '是否启用',
    valueType: 'switch',
    col: { span: 12 }
  }
]

const formRef = useTemplateRef<FormMethodsType<ProfileForm>>('formRef')
const form = useProForm(formRef)

async function submitForm() {
  await form.validate(values => {
    formSnapshot.value = values
  })
}
</script>

<style scoped lang="scss">
.pro-field-demo {
  color: var(--el-text-color-primary);

  &__header,
  .field-section__heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__header {
    margin-bottom: 16px;

    h1 {
      margin: 0;
      font-size: 22px;
      line-height: 1.4;
      font-weight: 600;
    }

    p {
      margin: 3px 0 0;
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }
}

.field-section {
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  background: var(--el-bg-color);

  & + & {
    margin-top: 16px;
  }

  &__heading {
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
    }

    p {
      margin: 2px 0 0;
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }

  &__actions {
    display: flex;
    gap: 8px;
  }
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px 24px;
}

.field-item {
  min-width: 0;

  &__label {
    display: block;
    margin-bottom: 8px;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}

.model-preview {
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr);
  gap: 12px;
  margin-top: 4px;
  padding: 14px 16px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  font-size: 13px;

  span {
    color: var(--el-text-color-secondary);
  }

  code {
    overflow-x: auto;
    color: var(--el-text-color-primary);
    white-space: pre-wrap;
  }
}

@media (max-width: 900px) {
  .field-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .pro-field-demo__header,
  .field-section__heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }
}
</style>
