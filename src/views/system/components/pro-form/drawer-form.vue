<template>
  <page-wrapper :full="false" class="drawer-demo">
    <header class="drawer-demo__header">
      <div>
        <h1>Drawer Form</h1>
        <p>适用于信息较多、需要保留页面上下文的编辑流程</p>
      </div>
      <el-button type="primary" @click="drawer.open({ title: '编辑项目配置' })">
        打开抽屉
      </el-button>
    </header>

    <section class="drawer-demo__summary">
      <div>
        <span>项目名称</span><strong>{{ savedValues?.name || '尚未提交' }}</strong>
      </div>
      <div>
        <span>负责人</span><strong>{{ savedValues?.owner || '-' }}</strong>
      </div>
      <div>
        <span>状态</span><strong>{{ savedValues?.enabled ? '启用' : '停用' }}</strong>
      </div>
    </section>

    <pro-drawer-form
      ref="drawerRef"
      :fields="fields"
      :initial-values="initialValues"
      :on-finish="saveProject"
      label-position="left"
      :label-width="88"
      @success="(_, values) => (savedValues = values)"
    />
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { PageWrapper } from '@/components'
import {
  ProDrawerForm,
  useProDrawerForm,
  type FormSchema,
  type ProDrawerFormInstance
} from '@framebase/element-plus-pro-components'

defineOptions({ name: 'ProDrawerFormPage' })

interface ProjectForm {
  name: string
  owner: string
  priority: 'normal' | 'high'
  enabled: boolean
  description: string
}

const initialValues: ProjectForm = {
  name: '运营分析平台',
  owner: '陈晨',
  priority: 'normal',
  enabled: true,
  description: ''
}
const savedValues = ref<ProjectForm>()
const fields: FormSchema<ProjectForm>[] = [
  { key: 'name', label: '项目名称', valueType: 'text', required: true },
  { key: 'owner', label: '负责人', valueType: 'text', required: true },
  {
    key: 'priority',
    label: '优先级',
    valueType: 'radio',
    options: [
      { label: '普通', value: 'normal' },
      { label: '高优先级', value: 'high' }
    ]
  },
  { key: 'enabled', label: '启用项目', valueType: 'switch' },
  {
    key: 'description',
    label: '项目说明',
    valueType: 'textarea',
    fieldProps: { rows: 5 }
  }
]

const drawerRef = useTemplateRef<ProDrawerFormInstance<ProjectForm, ProjectForm>>('drawerRef')
const drawer = useProDrawerForm(drawerRef)

async function saveProject(values: ProjectForm) {
  await new Promise(resolve => window.setTimeout(resolve, 450))
  return values
}
</script>

<style scoped lang="scss">
.drawer-demo {
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

  &__summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
    background: var(--el-bg-color);

    div {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 20px;

      & + div {
        border-left: 1px solid var(--el-border-color-lighter);
      }
    }

    span {
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }
}

@media (max-width: 640px) {
  .drawer-demo__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .drawer-demo__summary {
    grid-template-columns: 1fr;

    div + div {
      border-top: 1px solid var(--el-border-color-lighter);
      border-left: 0;
    }
  }
}
</style>
