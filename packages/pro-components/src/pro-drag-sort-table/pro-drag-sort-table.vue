<template>
  <div class="pro-drag-sort-table" :class="{ 'is-auto-fit': autoFitHeight }">
    <pro-table
      ref="tableRef"
      v-bind="$attrs"
      :data="innerData"
      :columns="dragColumns"
      :row-key="rowKey"
      :drag-sort="dragSortConfig"
      :auto-fit-height="autoFitHeight"
      :pagination="false"
      :index-border="false"
      @update:data="handleDataChange"
      @drag-sort-end="handleDragSortEnd"
    >
      <template v-for="(_, name) in $slots" #[name]="scope">
        <slot :name="name" v-bind="normalizeSlotScope(scope)" />
      </template>
    </pro-table>
  </div>
</template>

<script setup lang="ts" generic="TRecord extends object = Record<string, unknown>">
import { cloneDeep } from 'lodash-es'
import { computed, shallowRef, watch, type Ref } from 'vue'
import { ProTable } from '../pro-table'
import type { ProTableDragSort, ProTableExpose } from '../pro-table'
import type {
  ProDragSortTableEnd,
  ProDragSortTableExpose,
  ProDragSortTableProps
} from './pro-drag-sort-table'

defineOptions({
  name: 'ProDragSortTable',
  inheritAttrs: false
})

const props = withDefaults(defineProps<ProDragSortTableProps<TRecord>>(), {
  data: () => [],
  columns: () => [],
  rowKey: 'id',
  dragSortKey: '__drag__',
  animation: 180,
  autoFitHeight: true,
  showDragColumn: true
})

const emit = defineEmits<{
  (event: 'update:modelValue' | 'update:data' | 'change', data: TRecord[]): void
  (event: 'drag-sort-end', payload: ProDragSortTableEnd<TRecord>): void
}>()

const tableRef = shallowRef<ProTableExpose<TRecord> | null>(null)
const innerData = shallowRef<TRecord[]>([])
const dragColumns = computed(() => {
  if (!props.showDragColumn || props.columns.some(column => column.key === props.dragSortKey)) {
    return props.columns
  }
  return [
    {
      key: props.dragSortKey,
      title: '',
      width: 48,
      fixed: 'left' as const,
      align: 'center' as const,
      render: () => null
    },
    ...props.columns
  ]
})
const dragSortConfig = computed<ProTableDragSort<TRecord>>(() => ({
  handleColumnKey: props.showDragColumn ? props.dragSortKey : undefined,
  animation: props.animation
}))

function normalizeSlotScope(scope: unknown): Record<string, unknown> {
  return scope && typeof scope === 'object' ? (scope as Record<string, unknown>) : {}
}

watch(
  () => props.modelValue ?? props.data,
  data => {
    innerData.value = cloneDeep(data)
  },
  { immediate: true, deep: true }
)

function handleDataChange(data: TRecord[]) {
  innerData.value = cloneDeep(data)
  const value = cloneDeep(innerData.value)
  emit('update:modelValue', value)
  emit('update:data', value)
  emit('change', value)
}

function handleDragSortEnd(payload: ProDragSortTableEnd<TRecord>) {
  emit('drag-sort-end', { ...payload, data: cloneDeep(payload.data) })
}

const exposed: ProDragSortTableExpose<TRecord> = {
  tableRef: tableRef as Ref<ProTableExpose<TRecord> | null>,
  data: innerData
}

defineExpose(exposed)
</script>

<style scoped lang="scss">
.pro-drag-sort-table {
  display: flex;
  min-width: 0;
  flex-direction: column;

  &.is-auto-fit {
    height: 100%;
    min-height: 0;
    flex: 1 1 auto;
  }
}
</style>
