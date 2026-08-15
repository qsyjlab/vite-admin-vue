<template>
  <div class="pro-table-search">
    <slot name="prepend" />
    <pro-form
      ref="formRef"
      class="pro-table-search__form"
      :fields="orderedFields"
      :model="formModel"
      :layout="true"
      :inline="false"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :collapsible="collapsible"
      :collapsed="collapsed"
      :collapsed-rows="collapsedRows"
      :submitter="{ col: submitterCol }"
      @update:collapsed="setCollapsed"
    >
      <template v-if="$slots.field" #field="scope">
        <slot name="field" v-bind="normalizeFieldSlotScope(scope)" />
      </template>
      <template #submitter="submitterScope">
        <div class="pro-table-search__actions">
          <slot
            name="actions"
            :submit="submit"
            :reset="reset"
            :toggle-collapse="submitterScope.toggleCollapse"
            :collapsed="submitterScope.collapsed"
            :can-collapse="submitterScope.canCollapse"
          >
            <el-button type="primary" :icon="Search" :loading="loading" @click="submit">
              {{ submitText }}
            </el-button>
            <el-button :icon="RefreshRight" :disabled="loading" @click="reset">
              {{ resetText }}
            </el-button>
            <el-button
              v-if="submitterScope.canCollapse"
              link
              type="primary"
              @click="submitterScope.toggleCollapse"
            >
              {{ submitterScope.collapsed ? '展开' : '收起' }}
              <el-icon
                class="pro-table-search__collapse-icon"
                :class="{ 'is-expanded': !submitterScope.collapsed }"
              >
                <ArrowDown />
              </el-icon>
            </el-button>
          </slot>
        </div>
      </template>
    </pro-form>
    <slot name="append" />
  </div>
</template>

<script
  setup
  lang="ts"
  generic="TQuery extends FormModel = FormModel, TParams extends object = TQuery"
>
import { cloneDeep } from 'lodash-es'
import { computed, nextTick, ref, shallowRef, watch } from 'vue'
import { ArrowDown, RefreshRight, Search } from '@element-plus/icons-vue'
import { ElButton, ElIcon } from 'element-plus'
import { ProForm, type FormMethodsType, type FormModel } from '../pro-form'
import type {
  ProTableSearchExpose,
  ProTableSearchField,
  ProTableSearchProps
} from './pro-table-search'
import { compactProTableSearchValues, PRO_TABLE_SEARCH_DEFAULT_COL } from './pro-table-search-utils'

defineOptions({
  name: 'ProTableSearch'
})

const props = withDefaults(defineProps<ProTableSearchProps<TQuery, TParams>>(), {
  fields: () => [],
  omitEmpty: true,
  collapsed: undefined,
  defaultCollapsed: true,
  collapsedRows: () => ({ xs: 2, sm: 1 }),
  collapsible: true,
  submitterCol: () => ({ span: 6, xs: 24, sm: 8, md: 8, lg: 6 }),
  loading: false,
  submitText: '查询',
  resetText: '重置',
  searchOnReset: true,
  labelPosition: 'left',
  labelWidth: 80
})

const emit = defineEmits<{
  (event: 'update:modelValue', values: TQuery): void
  (event: 'search' | 'reset', params: TParams, values: TQuery): void
  (event: 'invalid'): void
  (event: 'update:collapsed', collapsed: boolean): void
  (event: 'collapse', collapsed: boolean): void
}>()

defineSlots<{
  prepend?: () => unknown
  append?: () => unknown
  field?: (scope: { field: ProTableSearchField<TQuery>; model: TQuery }) => unknown
  actions?: (scope: {
    submit: () => Promise<TParams | undefined>
    reset: () => Promise<TParams>
    toggleCollapse: () => void
    collapsed: boolean
    canCollapse: boolean
  }) => unknown
}>()

const formRef = ref<FormMethodsType<TQuery> | null>(null)
const internalCollapsed = ref(props.defaultCollapsed)
const collapsed = computed({
  get: () => props.collapsed ?? internalCollapsed.value,
  set: value => {
    if (props.collapsed === undefined) internalCollapsed.value = value
    emit('update:collapsed', value)
    emit('collapse', value)
  }
})
const initialSnapshot = cloneDeep(
  props.initialValues ?? props.modelValue ?? ({} as TQuery)
) as TQuery
const formModel = shallowRef<TQuery>(cloneDeep(props.modelValue ?? initialSnapshot))
const orderedFields = computed(() =>
  props.fields
    .filter(field => !field.hideInSearch)
    .map(field => ({ ...field, col: field.col ?? { ...PRO_TABLE_SEARCH_DEFAULT_COL } }))
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
)
watch(
  () => props.modelValue,
  values => {
    if (values) formModel.value = cloneDeep(values)
  },
  { deep: true }
)

async function transformValues(values: TQuery): Promise<TParams> {
  const normalized = props.omitEmpty ? compactProTableSearchValues(values) : values
  return props.transform ? props.transform(normalized) : (normalized as unknown as TParams)
}

async function submit() {
  if (!formRef.value) return undefined
  const valid = await formRef.value.validate()
  if (!valid) {
    emit('invalid')
    return undefined
  }
  const rawValues = formRef.value.getFieldsValue({ transform: false })
  const values = formRef.value.getFieldsValue()
  const params = await transformValues(values)
  formModel.value = cloneDeep(rawValues)
  emit('update:modelValue', cloneDeep(rawValues))
  emit('search', params, cloneDeep(rawValues))
  return params
}

async function reset() {
  if (!formRef.value) return transformValues(cloneDeep(initialSnapshot))
  formRef.value.resetFields()
  formRef.value.forceUpdateModel(cloneDeep(initialSnapshot))
  await nextTick()
  const rawValues = formRef.value.getFieldsValue({ transform: false })
  const params = await transformValues(formRef.value.getFieldsValue())
  formModel.value = cloneDeep(rawValues)
  emit('update:modelValue', cloneDeep(rawValues))
  emit('reset', params, cloneDeep(rawValues))
  if (props.searchOnReset) emit('search', params, cloneDeep(rawValues))
  return params
}

function toggleCollapse() {
  if (formRef.value) {
    formRef.value.toggleCollapse()
    return
  }
  collapsed.value = !collapsed.value
}

function setCollapsed(value: boolean) {
  collapsed.value = value
}

async function setFieldsValue(values: Partial<TQuery>) {
  formRef.value?.forceUpdateModel(cloneDeep(values))
  await nextTick()
}

async function getFieldsValue(transform = true) {
  await nextTick()
  return formRef.value?.getFieldsValue({ transform }) ?? cloneDeep(initialSnapshot)
}

function normalizeFieldSlotScope(scope: unknown) {
  return scope as { field: ProTableSearchField<TQuery>; model: TQuery }
}

const exposed: ProTableSearchExpose<TQuery, TParams> = {
  getForm: () => formRef.value,
  getCollapsed: () => formRef.value?.getCollapsed() ?? false,
  setCollapsed,
  submit,
  reset,
  toggleCollapse,
  setFieldsValue,
  getFieldsValue
}

defineExpose(exposed)
</script>

<style scoped lang="scss">
.pro-table-search {
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-extra-light);

  &__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    min-width: 0;
    flex-wrap: wrap;
    min-height: 32px;
    margin-bottom: 18px;
  }

  &__collapse-icon {
    margin-left: 4px;
    transition: transform var(--el-transition-duration-fast);

    &.is-expanded {
      transform: rotate(180deg);
    }
  }
}

@media (max-width: 767px) {
  .pro-table-search {
    padding: 12px;
  }
}
</style>
