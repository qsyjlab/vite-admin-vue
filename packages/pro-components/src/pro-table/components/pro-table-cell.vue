<template>
  <div v-if="dragHandle" class="pro-table-drag-handle">
    <el-icon class="pro-table-drag-handle__icon"><Rank /></el-icon>
    <div class="pro-table-cell__content">
      <pro-table-render-content v-if="slot" :content="slotContent" />
      <div v-else-if="isEditing" class="pro-table-editable-cell" :class="{ 'is-error': error }">
        <component
          :is="editorComponent"
          v-if="editorComponent"
          v-bind="editorProps"
          :model-value="value"
          @update:model-value="updateValue"
        />
        <pro-field
          v-else
          v-bind="editorProps"
          :model-value="value"
          :value-type="valueType"
          :value-enum="valueEnum"
          mode="edit"
          @update:model-value="updateValue"
        />
        <div v-if="error" class="pro-table-editable-cell__error">{{ error }}</div>
      </div>
      <pro-table-render-content v-else-if="column.render" :content="renderedContent" />
      <pro-field
        v-else
        :model-value="value"
        :value-type="valueType"
        :value-enum="valueEnum"
        :field-props="column.fieldProps"
        :empty-text="column.emptyText"
        :formatter="column.formatter"
        mode="read"
      />
    </div>
  </div>

  <template v-else>
    <pro-table-render-content v-if="slot" :content="slotContent" />
    <div v-else-if="isEditing" class="pro-table-editable-cell" :class="{ 'is-error': error }">
      <component
        :is="editorComponent"
        v-if="editorComponent"
        v-bind="editorProps"
        :model-value="value"
        @update:model-value="updateValue"
      />
      <pro-field
        v-else
        v-bind="editorProps"
        :model-value="value"
        :value-type="valueType"
        :value-enum="valueEnum"
        mode="edit"
        @update:model-value="updateValue"
      />
      <div v-if="error" class="pro-table-editable-cell__error">{{ error }}</div>
    </div>
    <pro-table-render-content v-else-if="column.render" :content="renderedContent" />
    <pro-field
      v-else
      :model-value="value"
      :value-type="valueType"
      :value-enum="valueEnum"
      :field-props="column.fieldProps"
      :empty-text="column.emptyText"
      :formatter="column.formatter"
      mode="read"
    />
  </template>
</template>

<script setup lang="ts" generic="TRecord extends object = Record<string, unknown>">
import { computed, resolveDynamicComponent, type Slots, type VNodeChild } from 'vue'
import { Rank } from '@element-plus/icons-vue'
import { ProField } from '../../pro-field'
import { getProPathValue } from '../../shared/pro-path'
import type { ProTableColumn, ProTableEditableRowState, ProTableRenderScope } from '../pro-table'
import { getProTableColumnKey } from '../pro-table-utils'
import { ProTableRenderContent } from './pro-table-render-content'

const props = defineProps<{
  row: TRecord
  index: number
  column: ProTableColumn<TRecord>
  tableSlots?: Slots
  dragHandle?: boolean
  editableState?: ProTableEditableRowState<TRecord>
  updateEditableValue?: (row: TRecord, column: ProTableColumn<TRecord>, value: unknown) => void
  customRenderAfter?: (value: VNodeChild, scope: ProTableRenderScope<TRecord>) => VNodeChild
}>()

const source = computed(() => props.editableState?.data ?? props.row)
const value = computed(() =>
  getProPathValue(source.value, props.column.dataIndex ?? String(props.column.key))
)
const scope = computed<ProTableRenderScope<TRecord>>(() => ({
  row: props.row,
  value: value.value,
  index: props.index,
  column: props.column,
  editableState: props.editableState
}))
const slot = computed(() => props.tableSlots?.[getProTableColumnKey(props.column)])
const slotContent = computed(() => slot.value?.(scope.value))
const isEditing = computed(() => {
  const editable =
    typeof props.column.editable === 'function'
      ? props.column.editable(scope.value)
      : props.column.editable
  return Boolean(editable && props.editableState)
})
const valueType = computed(() =>
  typeof props.column.valueType === 'function'
    ? props.column.valueType(scope.value)
    : props.column.valueType
)
const valueEnum = computed(() =>
  typeof props.column.valueEnum === 'function'
    ? props.column.valueEnum(scope.value)
    : props.column.valueEnum
)
const error = computed(() => props.editableState?.errors[String(props.column.key)]?.[0]?.message)
const editorComponent = computed(() => {
  const component = props.column.rowComponent?.el
  return component ? resolveDynamicComponent(component) : undefined
})
const editorProps = computed(() => ({
  ...props.column.fieldProps,
  ...(typeof props.column.rowComponent?.props === 'function'
    ? props.column.rowComponent.props(scope.value)
    : props.column.rowComponent?.props)
}))
const renderedContent = computed(() => {
  const rendered = props.column.render?.(scope.value)
  if (rendered == null) return []
  return props.customRenderAfter ? props.customRenderAfter(rendered, scope.value) : rendered
})

function updateValue(nextValue: unknown) {
  props.updateEditableValue?.(props.row, props.column, nextValue)
}
</script>

<style scoped lang="scss">
.pro-table-cell__content {
  min-width: 0;
  flex: 1;
}
</style>
