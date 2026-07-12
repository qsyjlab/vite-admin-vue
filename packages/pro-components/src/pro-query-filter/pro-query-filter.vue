<template>
  <section class="pro-query-filter">
    <div v-if="$slots.header || showActiveCount" class="pro-query-filter__header">
      <slot name="header" :active-count="activeCount">
        <span>查询条件</span>
        <el-tag v-if="showActiveCount && activeCount" type="primary" effect="light">
          已启用 {{ activeCount }} 项
        </el-tag>
      </slot>
    </div>
    <pro-table-search
      ref="searchRef"
      :model-value="modelValue"
      :initial-values="initialValues"
      :fields="fields"
      :transform="transform"
      :loading="loading"
      :collapsed="collapsed"
      :default-collapsed="defaultCollapsed"
      :collapsed-rows="collapsedRows"
      @update:model-value="handleModelChange"
      @update:collapsed="value => $emit('update:collapsed', value)"
      @search="(params, values) => $emit('search', params, values)"
      @reset="(params, values) => $emit('reset', params, values)"
    >
      <template v-for="(_, slotName) in $slots" #[slotName]="scope">
        <slot v-if="slotName !== 'header'" :name="slotName" v-bind="scope" />
      </template>
      <template #append>
        <div v-if="activeCount" class="pro-query-filter__summary">
          <span>当前启用 {{ activeCount }} 个查询条件</span>
          <el-button link type="primary" @click="clear">{{ clearText }}</el-button>
        </div>
      </template>
    </pro-table-search>
  </section>
</template>

<script
  setup
  lang="ts"
  generic="TQuery extends FormModel = FormModel, TParams extends object = TQuery"
>
import { computed, ref } from 'vue'
import { ElButton, ElTag } from 'element-plus'
import type { FormModel } from '../pro-form'
import { ProTableSearch, type ProTableSearchInstance } from '../pro-table-search'
import type { ProQueryFilterProps } from './pro-query-filter'

defineOptions({ name: 'ProQueryFilter' })
const props = withDefaults(defineProps<ProQueryFilterProps<TQuery, TParams>>(), {
  fields: () => [],
  defaultCollapsed: true,
  showActiveCount: true,
  clearText: '清空条件'
})
const emit = defineEmits<{
  'update:model-value': [values: TQuery]
  'update:collapsed': [value: boolean]
  search: [params: TParams, values: TQuery]
  reset: [params: TParams, values: TQuery]
}>()
const searchRef = ref<ProTableSearchInstance<TQuery, TParams>>()
const activeCount = computed(() => countActiveValues(props.modelValue))
function handleModelChange(values: TQuery) {
  emit('update:model-value', values)
}
async function clear() {
  await searchRef.value?.reset()
}
function countActiveValues(values?: TQuery) {
  if (!values) return 0
  return Object.values(values).filter(
    value =>
      value !== undefined &&
      value !== null &&
      value !== '' &&
      (!Array.isArray(value) || value.length)
  ).length
}
defineExpose({
  submit: () => searchRef.value?.submit(),
  reset: () => searchRef.value?.reset(),
  clear,
  getActiveCount: () => activeCount.value
})
</script>

<style scoped lang="scss">
.pro-query-filter {
  overflow: hidden;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color-overlay);
}
.pro-query-filter__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  font-weight: 600;
}
.pro-query-filter__summary {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 16px 12px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
:deep(.pro-table-search) {
  border-bottom: 0;
  background: transparent;
}
</style>
