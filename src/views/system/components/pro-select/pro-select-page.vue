<template>
  <page-wrapper :full="false" class="pro-select-demo">
    <header class="pro-select-demo__header">
      <div>
        <h1>ProSelect</h1>
        <p>选择器</p>
      </div>
      <el-tag type="success" effect="plain">Vue 3.5 泛型组件</el-tag>
    </header>

    <div class="pro-select-demo__grid">
      <section class="demo-panel">
        <div class="demo-panel__header">
          <h2>基础选择</h2>
          <span>单选</span>
        </div>
        <ProSelect v-model="basicValue" :options="cityOptions" placeholder="选择城市" />
        <output class="demo-panel__value">{{ formatValue(basicValue) }}</output>
      </section>

      <section class="demo-panel">
        <div class="demo-panel__header">
          <h2>多选</h2>
          <span>{{ multipleValue.length }} 项</span>
        </div>
        <ProSelect
          v-model="multipleValue"
          :options="cityOptions"
          :multiple="true"
          collapse-tags
          collapse-tags-tooltip
          filterable
          placeholder="选择多个城市"
        >
          <template #option="{ option }">
            <div class="option-row">
              <span>{{ option.label }}</span>
              <el-tag size="small" effect="plain">{{ option.region }}</el-tag>
            </div>
          </template>
        </ProSelect>
        <output class="demo-panel__value">{{ formatValue(multipleValue) }}</output>
      </section>

      <section class="demo-panel">
        <div class="demo-panel__header">
          <h2>分组选项</h2>
          <span>group</span>
        </div>
        <ProSelect
          v-model="groupValue"
          :options="groupOptions"
          group
          filterable
          placeholder="按区域选择"
        />
        <output class="demo-panel__value">{{ formatValue(groupValue) }}</output>
      </section>

      <section class="demo-panel">
        <div class="demo-panel__header">
          <h2>远程搜索</h2>
          <span>{{ remoteResultCount }} 条结果</span>
        </div>
        <ProSelect
          v-model="remoteValue"
          :request="requestCities"
          remote
          filterable
          clearable
          placeholder="输入城市名称"
          @request-success="options => (remoteResultCount = options.length)"
        />
        <output class="demo-panel__value">{{ formatValue(remoteValue) }}</output>
      </section>

      <section class="demo-panel">
        <div class="demo-panel__header">
          <h2>字段映射</h2>
          <span>title / code</span>
        </div>
        <ProSelect
          v-model="mappedValue"
          :options="departmentOptions"
          :fields="{
            label: 'title',
            value: 'code',
            disabled: 'inactive'
          }"
          placeholder="选择部门"
        />
        <output class="demo-panel__value">{{ formatValue(mappedValue) }}</output>
      </section>

      <section class="demo-panel">
        <div class="demo-panel__header">
          <h2>实例操作</h2>
          <span>useTemplateRef</span>
        </div>
        <ProSelect
          ref="selectRef"
          v-model="refValue"
          :request="requestCities"
          filterable
          placeholder="通过 Ref 控制"
        />
        <div class="demo-panel__actions">
          <el-button :icon="Aim" @click="focusSelect">聚焦</el-button>
          <el-button :icon="Refresh" @click="reloadSelect">重新加载</el-button>
          <el-button :icon="Delete" @click="clearSelect">清空选项</el-button>
        </div>
      </section>
    </div>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { Aim, Delete, Refresh } from '@element-plus/icons-vue'
import { PageWrapper } from '@/components'
import {
  ProSelect,
  useProSelect,
  type ProSelectInstance,
  type ProSelectRequestQuery
} from '@framebase/element-plus-pro-components'

defineOptions({
  name: 'ProSelectPage'
})

interface CityOption {
  label: string
  value: string
  region: string
  disabled?: boolean
}

interface GroupOption {
  label: string
  value?: string
  region?: string
  disabled?: boolean
  options?: GroupOption[]
}

interface DepartmentOption {
  title: string
  code: string
  inactive?: boolean
}

const cityOptions: CityOption[] = [
  { label: '上海', value: 'shanghai', region: '华东' },
  { label: '北京', value: 'beijing', region: '华北' },
  { label: '深圳', value: 'shenzhen', region: '华南' },
  { label: '成都', value: 'chengdu', region: '西南' },
  { label: '杭州', value: 'hangzhou', region: '华东' },
  { label: '武汉', value: 'wuhan', region: '华中', disabled: true }
]

const groupOptions: GroupOption[] = [
  {
    label: '华东地区',
    options: cityOptions.filter(option => option.region === '华东').map(option => ({ ...option }))
  },
  {
    label: '其他地区',
    options: cityOptions.filter(option => option.region !== '华东').map(option => ({ ...option }))
  }
]

const departmentOptions: DepartmentOption[] = [
  { title: '产品研发部', code: 'product' },
  { title: '平台技术部', code: 'platform' },
  { title: '客户成功部', code: 'success' },
  { title: '已停用部门', code: 'inactive', inactive: true }
]

const basicValue = ref<string>()
const multipleValue = ref<string[]>([])
const groupValue = ref<string>()
const remoteValue = ref<string>()
const mappedValue = ref<string>()
const refValue = ref<string>()
const remoteResultCount = ref(cityOptions.length)

const selectRef = useTemplateRef<ProSelectInstance<CityOption>>('selectRef')
const select = useProSelect(selectRef)

async function requestCities(query: ProSelectRequestQuery): Promise<CityOption[]> {
  await new Promise(resolve => setTimeout(resolve, 350))
  const keyword = query.keyword?.trim().toLowerCase()

  if (!keyword) return cityOptions

  return cityOptions.filter(option =>
    `${option.label} ${option.value}`.toLowerCase().includes(keyword)
  )
}

function formatValue(value: unknown) {
  if (Array.isArray(value)) return value.length ? value.join(' / ') : '未选择'
  return value === undefined || value === '' ? '未选择' : String(value)
}

async function focusSelect() {
  await select.focus()
}

async function reloadSelect() {
  await select.reload()
}

async function clearSelect() {
  await select.clearOptions()
  refValue.value = undefined
}
</script>

<style scoped lang="scss">
.pro-select-demo {
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
      line-height: 1.4;
      font-weight: 600;
    }

    p {
      margin: 3px 0 0;
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
}

.demo-panel {
  min-width: 0;
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  background: var(--el-bg-color);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;

    h2 {
      margin: 0;
      font-size: 15px;
      line-height: 1.4;
      font-weight: 600;
    }

    span {
      color: var(--el-text-color-secondary);
      font-size: 12px;
    }
  }

  :deep(.el-select) {
    width: 100%;
  }

  &__value {
    display: block;
    min-height: 20px;
    margin-top: 12px;
    color: var(--el-text-color-secondary);
    font-size: 13px;
    overflow-wrap: anywhere;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }
}

.option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

@media (max-width: 900px) {
  .pro-select-demo__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 480px) {
  .pro-select-demo__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .demo-panel {
    padding: 16px;
  }
}
</style>
