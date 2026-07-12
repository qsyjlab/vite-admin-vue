<template>
  <page-wrapper :full="false" class="pro-choice-demo">
    <header class="pro-choice-demo__header">
      <div>
        <h1>ProRadioGroup</h1>
        <p>单项选择</p>
      </div>
      <el-tag effect="plain">泛型值与选项</el-tag>
    </header>

    <div class="pro-choice-demo__grid">
      <section class="choice-panel">
        <div class="choice-panel__header">
          <h2>基础单选</h2>
          <span>string</span>
        </div>
        <ProRadioGroup v-model="statusValue" class="choice-group" :options="statusOptions" />
        <output class="choice-panel__value">{{ statusValue }}</output>
      </section>

      <section class="choice-panel">
        <div class="choice-panel__header">
          <h2>按钮模式</h2>
          <span>number</span>
        </div>
        <ProRadioGroup
          v-model="priorityValue"
          class="choice-group choice-group--button"
          :options="priorityOptions"
          option-type="button"
        />
        <output class="choice-panel__value">优先级 {{ priorityValue }}</output>
      </section>

      <section class="choice-panel">
        <div class="choice-panel__header">
          <h2>字段映射</h2>
          <span>数组路径</span>
        </div>
        <ProRadioGroup
          v-model="channelValue"
          class="choice-group"
          :options="channelOptions"
          :fields="channelFields"
        />
        <output class="choice-panel__value">{{ channelValue }}</output>
      </section>

      <section class="choice-panel">
        <div class="choice-panel__header">
          <h2>插槽与实例</h2>
          <span>useTemplateRef</span>
        </div>
        <ProRadioGroup
          ref="radioGroupRef"
          v-model="sceneValue"
          class="choice-group"
          :options="sceneOptions"
        >
          <template #option="{ option, selected }">
            <span class="choice-option">
              {{ option.label }}
              <el-tag v-if="selected" size="small" effect="plain">当前</el-tag>
            </span>
          </template>
        </ProRadioGroup>
        <div class="choice-panel__actions">
          <el-button :icon="Aim" @click="focusGroup">聚焦首项</el-button>
          <el-button :icon="Remove" @click="sceneValue = undefined">清除值</el-button>
        </div>
      </section>
    </div>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { Aim, Remove } from '@element-plus/icons-vue'
import { PageWrapper } from '@/components'
import {
  ProRadioGroup,
  useProRadioGroup,
  type ProOptionFields,
  type ProRadioGroupInstance
} from '@vite-admin/pro-components'

defineOptions({
  name: 'ProRadioGroupPage'
})

interface StatusOption {
  label: string
  value: string
  disabled?: boolean
}

interface ChannelOption {
  profile: {
    name: string
    code: string
  }
  locked?: boolean
}

const statusOptions: StatusOption[] = [
  { label: '待处理', value: 'pending' },
  { label: '处理中', value: 'processing' },
  { label: '已完成', value: 'done' },
  { label: '已归档', value: 'archived', disabled: true }
]

const priorityOptions = [
  { label: '低', value: 1 },
  { label: '中', value: 2 },
  { label: '高', value: 3 }
]

const channelOptions: ChannelOption[] = [
  { profile: { name: '站内信', code: 'inbox' } },
  { profile: { name: '邮件', code: 'email' } },
  { profile: { name: '短信', code: 'sms' }, locked: true }
]

const channelFields: Partial<ProOptionFields<ChannelOption>> = {
  label: ['profile', 'name'],
  value: ['profile', 'code'],
  disabled: 'locked'
}

const sceneOptions = [
  { label: '开发环境', value: 'development' },
  { label: '测试环境', value: 'testing' },
  { label: '生产环境', value: 'production' }
]

const statusValue = ref('processing')
const priorityValue = ref(2)
const channelValue = ref('email')
const sceneValue = ref<string>()

const radioGroupRef = useTemplateRef<ProRadioGroupInstance<string>>('radioGroupRef')
const radioGroup = useProRadioGroup(radioGroupRef)

async function focusGroup() {
  await radioGroup.focus()
}
</script>

<style scoped lang="scss">
@use '../pro-choice/pro-choice-demo.scss';
</style>
