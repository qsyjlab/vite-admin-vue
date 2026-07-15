<template>
  <page-wrapper :full="false" class="pro-choice-demo">
    <header class="pro-choice-demo__header">
      <div>
        <h1>ProCheckboxGroup</h1>
        <p>多项选择</p>
      </div>
      <el-tag effect="plain">受控数组模型</el-tag>
    </header>

    <div class="pro-choice-demo__grid">
      <section class="choice-panel">
        <div class="choice-panel__header">
          <h2>基础多选</h2>
          <span>{{ skillValues.length }} 项</span>
        </div>
        <ProCheckboxGroup v-model="skillValues" class="choice-group" :options="skillOptions" />
        <output class="choice-panel__value">{{ formatValues(skillValues) }}</output>
      </section>

      <section class="choice-panel">
        <div class="choice-panel__header">
          <h2>选择限制</h2>
          <span>1 - 2 项</span>
        </div>
        <ProCheckboxGroup
          v-model="memberValues"
          class="choice-group"
          :options="memberOptions"
          :min="1"
          :max="2"
        />
        <output class="choice-panel__value">{{ formatValues(memberValues) }}</output>
      </section>

      <section class="choice-panel">
        <div class="choice-panel__header">
          <h2>按钮模式</h2>
          <span>number[]</span>
        </div>
        <ProCheckboxGroup
          v-model="weekdayValues"
          class="choice-group choice-group--button"
          :options="weekdayOptions"
          option-type="button"
        />
        <output class="choice-panel__value">{{ formatValues(weekdayValues) }}</output>
      </section>

      <section class="choice-panel">
        <div class="choice-panel__header">
          <h2>字段映射与实例</h2>
          <span>useTemplateRef</span>
        </div>
        <ProCheckboxGroup
          ref="checkboxGroupRef"
          v-model="permissionValues"
          class="choice-group"
          :options="permissionOptions"
          :fields="permissionFields"
        >
          <template #option="{ option, selected }">
            <span class="choice-option">
              {{ option.content.title }}
              <el-tag v-if="selected" size="small" effect="plain">已选</el-tag>
            </span>
          </template>
        </ProCheckboxGroup>
        <div class="choice-panel__actions">
          <el-button :icon="Aim" @click="focusGroup">聚焦首项</el-button>
          <el-button :icon="Delete" @click="permissionValues = []">清空选择</el-button>
        </div>
      </section>
    </div>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { Aim, Delete } from '@element-plus/icons-vue'
import { PageWrapper } from '@/components'
import {
  ProCheckboxGroup,
  useProCheckboxGroup,
  type ProCheckboxGroupInstance,
  type ProOptionFields
} from '@framebase/element-plus-pro-components'

defineOptions({
  name: 'ProCheckboxGroupPage'
})

interface PermissionOption {
  content: {
    title: string
    code: string
  }
  readonly?: boolean
}

const skillOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Vite', value: 'vite' },
  { label: '已停用', value: 'disabled', disabled: true }
]

const memberOptions = [
  { label: '产品经理', value: 'product' },
  { label: '设计师', value: 'design' },
  { label: '开发工程师', value: 'engineer' }
]

const weekdayOptions = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 }
]

const permissionOptions: PermissionOption[] = [
  { content: { title: '查看数据', code: 'read' } },
  { content: { title: '编辑数据', code: 'write' } },
  { content: { title: '删除数据', code: 'delete' }, readonly: true }
]

const permissionFields: Partial<ProOptionFields<PermissionOption>> = {
  label: ['content', 'title'],
  value: ['content', 'code'],
  disabled: 'readonly'
}

const skillValues = ref(['vue', 'typescript'])
const memberValues = ref(['product'])
const weekdayValues = ref([1, 3, 5])
const permissionValues = ref(['read'])

const checkboxGroupRef = useTemplateRef<ProCheckboxGroupInstance<string>>('checkboxGroupRef')
const checkboxGroup = useProCheckboxGroup(checkboxGroupRef)

function formatValues(values: Array<string | number>) {
  return values.length ? values.join(' / ') : '未选择'
}

async function focusGroup() {
  await checkboxGroup.focus()
}
</script>

<style scoped lang="scss">
@use '../pro-choice/pro-choice-demo.scss';
</style>
