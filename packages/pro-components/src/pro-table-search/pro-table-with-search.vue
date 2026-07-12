<template>
  <div class="pro-table-with-search">
    <pro-table-search
      ref="searchRef"
      v-bind="searchProps"
      :fields="searchFields"
      :model-value="searchModel"
      :initial-values="initialValues"
      @update:model-value="updateSearchModel"
      @search="handleSearch"
      @reset="handleReset"
      @invalid="emit('invalid')"
      @update:collapsed="value => emit('update:collapsed', value)"
      @collapse="value => emit('collapse', value)"
    >
      <template v-if="$slots.searchPrepend" #prepend>
        <slot name="searchPrepend" />
      </template>
      <template v-if="$slots.searchField" #field="scope">
        <slot name="searchField" v-bind="scope" />
      </template>
      <template v-if="$slots.searchActions" #actions="scope">
        <slot name="searchActions" v-bind="scope" />
      </template>
      <template v-if="$slots.searchAppend" #append>
        <slot name="searchAppend" />
      </template>
    </pro-table-search>

    <div class="pro-table-with-search__table">
      <pro-table
        ref="tableRef"
        v-bind="tableProps"
        :columns="renderColumns"
        :request="request"
        :params="mergedParams"
        auto-fit-height
      >
        <template v-if="$slots.headerTitle" #headerTitle>
          <slot name="headerTitle" />
        </template>
        <template v-if="$slots.toolbar" #toolbar>
          <slot name="toolbar" />
        </template>
      </pro-table>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="
    TRecord extends object = Record<string, unknown>,
    TQuery extends FormModel = FormModel,
    TResponse = ProTableRequestResult<TRecord>
  "
>
import { computed, shallowRef, useSlots } from 'vue'
import { ProTable, type ProTableInstance, type ProTableRequestResult } from '../pro-table'
import type { FormModel } from '../pro-form'
import ProTableSearch from './pro-table-search.vue'
import type { ProTableSearchInstance } from './pro-table-search'
import type { ProTableWithSearchExpose, ProTableWithSearchProps } from './pro-table-with-search'

defineOptions({
  name: 'ProTableWithSearch'
})

const props = withDefaults(defineProps<ProTableWithSearchProps<TRecord, TQuery, TResponse>>(), {
  columns: () => [],
  searchFields: () => [],
  params: () => ({}) as TQuery,
  tableProps: () => ({}),
  searchProps: () => ({})
})

const emit = defineEmits<{
  search: [params: TQuery]
  reset: [params: Partial<TQuery>, values: TQuery]
  invalid: []
  'update:collapsed': [collapsed: boolean]
  collapse: [collapsed: boolean]
}>()

const slots = useSlots()
const tableRef = shallowRef<ProTableInstance<TRecord> | null>(null)
const searchRef = shallowRef<ProTableSearchInstance<TQuery, Partial<TQuery>> | null>(null)
const searchModel = shallowRef<TQuery>({ ...(props.initialValues ?? ({} as TQuery)) })
const activeSearchParams = shallowRef<Partial<TQuery>>({ ...searchModel.value })
const mergedParams = computed<TQuery>(() => ({
  ...props.params,
  ...activeSearchParams.value
}))
const renderColumns = computed(() =>
  props.columns.map(column => {
    const slot = slots[String(column.key)]
    return slot ? { ...column, render: scope => slot(scope) } : column
  })
)

function handleSearch(params: Partial<TQuery>) {
  activeSearchParams.value = { ...params }
  emit('search', mergedParams.value)
}

function updateSearchModel(values: TQuery) {
  searchModel.value = values
}

function handleReset(params: Partial<TQuery>, values: TQuery) {
  emit('reset', params, values)
}

const exposed: ProTableWithSearchExpose<TRecord, TQuery> = {
  getTable: () => tableRef.value,
  getSearch: () => searchRef.value,
  submit: () => searchRef.value?.submit() ?? Promise.resolve(undefined),
  reset: () => searchRef.value?.reset() ?? Promise.resolve({}),
  getCollapsed: () => searchRef.value?.getCollapsed() ?? false,
  setCollapsed: collapsed => searchRef.value?.setCollapsed(collapsed),
  toggleCollapse: () => searchRef.value?.toggleCollapse(),
  reload: () => tableRef.value?.reload(true) ?? Promise.resolve([])
}

defineExpose(exposed)
</script>

<style scoped lang="scss">
.pro-table-with-search {
  display: flex;
  min-width: 0;
  height: 100%;
  min-height: 0;
  flex-direction: column;

  &__table {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    padding-top: 12px;
  }
}
</style>
