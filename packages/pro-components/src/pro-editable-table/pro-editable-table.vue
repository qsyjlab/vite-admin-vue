<template>
  <div class="pro-editable-table" :class="{ 'is-auto-fit': autoFitHeight }">
    <div class="pro-editable-table__table">
      <pro-table
        ref="tableRef"
        v-bind="{ ...resolvedTableProps, ...$attrs }"
        :data="innerData"
        :columns="editableColumns"
        :row-key="rowKey"
        :editable="editableConfig"
        :auto-fit-height="autoFitHeight"
        :pagination="false"
        :options="options"
        :index-border="resolvedIndexBorder"
        @update:data="handleDataChange"
      />
    </div>

    <el-button v-if="showAddButton" class="pro-editable-table__add" :icon="Plus" @click="addRow">
      添加一行数据
    </el-button>
  </div>
</template>

<script setup lang="ts" generic="TRecord extends object = Record<string, unknown>">
import { cloneDeep } from 'lodash-es'
import { computed, h, nextTick, shallowRef, useSlots, watch } from 'vue'
import { ElButton, ElPopconfirm, ElSpace } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ProTable } from '../pro-table'
import { getProTableRowKey } from '../pro-table/pro-table-utils'
import type { ProTableEditable, ProTableExpose, ProTableRenderScope } from '../pro-table'
import type { ProEditableTableExpose, ProEditableTableProps } from './pro-editable-table'
import {
  applyProEditableTableColumnDefaults,
  createProEditableTableNewRowTracker,
  hasProEditableTableColumn
} from './pro-editable-table-utils'

defineOptions({
  name: 'ProEditableTable',
  inheritAttrs: false
})

const props = withDefaults(defineProps<ProEditableTableProps<TRecord>>(), {
  data: () => [],
  columns: () => [],
  rowKey: 'id',
  autoFitHeight: true,
  appendPosition: 'bottom',
  mode: 'multiple',
  operationKey: 'operation',
  showActions: true,
  showAddButton: true,
  options: true
})

const emit = defineEmits<{
  (event: 'update:modelValue' | 'update:data' | 'change', data: TRecord[]): void
  (event: 'appendError', error: { message: string }): void
}>()

const slots = useSlots()
const tableRef = shallowRef<ProTableExpose<TRecord> | null>(null)
const innerData = shallowRef<TRecord[]>([])
const newRowTracker = createProEditableTableNewRowTracker<TRecord>(() => props.rowKey)
const resolvedTableProps = computed(() => ({
  ...props.tableProps,
  loading: props.loading ?? props.tableProps?.loading,
  checkable: props.checkable ?? props.tableProps?.checkable,
  reserveSelection: props.reserveSelection ?? props.tableProps?.reserveSelection,
  selectedKeys: props.selectedKeys ?? props.tableProps?.selectedKeys,
  cacheSelectedData: props.cacheSelectedData ?? props.tableProps?.cacheSelectedData,
  headerTitle: props.headerTitle ?? props.tableProps?.headerTitle,
  columnsState: props.columnsState ?? props.tableProps?.columnsState,
  dragSort: props.dragSort ?? props.tableProps?.dragSort,
  customRenderAfter: props.customRenderAfter ?? props.tableProps?.customRenderAfter,
  showAlert: props.showAlert ?? props.tableProps?.showAlert,
  alwaysShowAlert: props.alwaysShowAlert ?? props.tableProps?.alwaysShowAlert,
  height: props.height ?? props.tableProps?.height,
  size: props.size ?? props.tableProps?.size,
  border: props.border ?? props.tableProps?.border,
  tableLayout: props.tableLayout ?? props.tableProps?.tableLayout
}))
const resolvedIndexBorder = computed(
  () => props.indexBorder ?? props.tableProps?.indexBorder ?? false
)
const editableColumns = computed(() => {
  const resolveColumn = (
    column: (typeof props.columns)[number]
  ): (typeof props.columns)[number] => {
    const slot = slots[String(column.key)]
    const operation = String(column.key) === props.operationKey
    return {
      ...column,
      children: column.children?.map(resolveColumn),
      render: slot
        ? (scope: ProTableRenderScope<TRecord>) => slot(scope)
        : (column.render ?? (operation ? renderOperation : undefined))
    }
  }
  const columns = applyProEditableTableColumnDefaults(props.columns, props.operationKey).map(
    resolveColumn
  )
  if (!props.showActions || hasProEditableTableColumn(columns, props.operationKey)) {
    return columns
  }
  return [
    ...columns,
    {
      key: props.operationKey,
      title: '操作',
      width: 180,
      fixed: 'right' as const,
      editable: false,
      render: renderOperation
    }
  ]
})
const editableConfig = computed<ProTableEditable<TRecord>>(() => ({
  ...props.editable,
  mode: props.editable?.mode ?? props.mode,
  enableValidate: props.editable?.enableValidate ?? true,
  onSave: props.editable?.onSave ?? props.onSave,
  onCancel: props.editable?.onCancel ?? props.onCancel,
  onDelete: props.editable?.onDelete ?? props.onDelete,
  onError: props.editable?.onError ?? props.onError
}))

watch(
  () => props.modelValue ?? props.data,
  data => {
    innerData.value = cloneDeep(data)
    newRowTracker.sync(innerData.value)
  },
  { immediate: true, deep: true }
)

function handleDataChange(data: TRecord[]) {
  innerData.value = cloneDeep(data)
  emitData()
}

async function addRow() {
  if (editableConfig.value.mode === 'single' && tableRef.value?.hasEditingRow()) {
    emit('appendError', {
      message: props.appendErrorText ?? '当前存在未保存行，请先保存！'
    })
    return undefined
  }

  const row = props.createRow?.() ?? createDefaultRow()
  const rowKey = getRowKey(row)
  if (innerData.value.some(item => getProTableRowKey(item, props.rowKey) === rowKey)) {
    emit('appendError', {
      message: props.appendErrorText ?? '新增行标识已存在，请确保 createRow 返回唯一 rowKey！'
    })
    return undefined
  }
  newRowTracker.add(row)
  innerData.value =
    props.appendPosition === 'top' ? [row, ...innerData.value] : [...innerData.value, row]
  emitData()
  await nextTick()
  if (!tableRef.value?.startEditable(rowKey)) {
    const result = newRowTracker.remove(innerData.value, rowKey)
    innerData.value = result.data
    emitData()
    return undefined
  }
  return row
}

function createDefaultRow() {
  if (typeof props.rowKey !== 'string') {
    throw new Error('ProEditableTable requires createRow when rowKey is a function')
  }
  return { [props.rowKey]: Date.now() } as TRecord
}

function getRowKey(row: TRecord) {
  const key = getProTableRowKey(row, props.rowKey)
  if (key === undefined) throw new Error('Editable row key is undefined')
  return key
}

function emitData() {
  const data = cloneDeep(innerData.value)
  emit('update:modelValue', data)
  emit('update:data', data)
  emit('change', data)
}

function renderOperation(scope: ProTableRenderScope<TRecord>) {
  const customSlot = slots.operation
  if (customSlot) return customSlot(scope)
  const rowKey = getRowKey(scope.row)
  const actions = scope.editableState
    ? [
        h(
          ElButton,
          { link: true, type: 'primary', onClick: () => saveEditable(rowKey) },
          () => '保存'
        ),
        h(ElButton, { link: true, onClick: () => cancelEditable(rowKey) }, () => '取消')
      ]
    : [
        h(
          ElButton,
          { link: true, type: 'primary', onClick: () => startEditable(rowKey) },
          () => '编辑'
        )
      ]
  actions.push(
    h(
      ElPopconfirm,
      { title: '确定删除当前行数据？', onConfirm: () => deleteEditable(rowKey) },
      { reference: () => h(ElButton, { link: true, type: 'danger' }, () => '删除') }
    )
  )
  return h(ElSpace, { size: 4 }, () => actions)
}

const startEditable = (rowKey: string | number) => tableRef.value?.startEditable(rowKey) ?? false
async function cancelEditable(rowKey: string | number) {
  const cancelled = (await tableRef.value?.cancelEditable(rowKey)) ?? false
  if (!cancelled) return false
  const result = newRowTracker.remove(innerData.value, rowKey)
  if (result.removed) {
    innerData.value = result.data
    emitData()
  }
  return true
}

async function saveEditable(rowKey: string | number) {
  const saved = (await tableRef.value?.saveEditable(rowKey)) ?? false
  if (saved) newRowTracker.release(rowKey)
  return saved
}

async function deleteEditable(rowKey: string | number) {
  const deleted = (await tableRef.value?.deleteEditable(rowKey)) ?? false
  if (deleted) newRowTracker.release(rowKey)
  return deleted
}

const clearEditRows = () => tableRef.value?.clearEditRows()
const hasEditingRow = () => tableRef.value?.hasEditingRow() ?? false
const getEditableKeys = () => tableRef.value?.getEditableKeys() ?? []
const getRowEditableState = (rowKey: string | number) => tableRef.value?.getRowEditableState(rowKey)
const validateEditable = (rowKey?: string | number) =>
  tableRef.value?.validateEditable(rowKey) ?? Promise.resolve(false)
const clearSelection = () => tableRef.value?.clearSelection()
const clearSelectedKeys = () => tableRef.value?.clearSelectedKeys()
const getSelectedRows = () => tableRef.value?.getSelectedRows() ?? []
const doLayout = () => tableRef.value?.doLayout()
const doHeight = () => tableRef.value?.doHeight()

async function saveAllEditable() {
  const rowKeys = getEditableKeys()
  const saved = (await tableRef.value?.saveAllEditable()) ?? false
  const editingKeys = new Set(getEditableKeys())
  for (const rowKey of rowKeys) {
    if (!editingKeys.has(rowKey)) newRowTracker.release(rowKey)
  }
  return saved
}

async function cancelAllEditable() {
  const rowKeys = getEditableKeys()
  const cancelled = (await tableRef.value?.cancelAllEditable()) ?? false
  const editingKeys = new Set(getEditableKeys())
  let changed = false
  for (const rowKey of rowKeys) {
    if (editingKeys.has(rowKey)) continue
    const result = newRowTracker.remove(innerData.value, rowKey)
    if (!result.removed) continue
    innerData.value = result.data
    changed = true
  }
  if (changed) emitData()
  return cancelled
}

const exposed: ProEditableTableExpose<TRecord> = {
  getData: () => cloneDeep(innerData.value),
  getEditableKeys,
  addRow,
  startEditable,
  cancelEditable,
  saveEditable,
  deleteEditable,
  getRowEditableState,
  clearEditRows,
  hasEditingRow,
  validateEditable,
  saveAllEditable,
  cancelAllEditable,
  clearSelection,
  clearSelectedKeys,
  getSelectedRows,
  doLayout,
  doHeight
}

defineExpose(exposed)
</script>

<style scoped lang="scss">
.pro-editable-table {
  display: flex;
  min-width: 0;
  flex-direction: column;

  &.is-auto-fit {
    height: 100%;
    min-height: 0;
    flex: 1 1 auto;
  }

  &__table {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
  }

  &__add {
    width: 100%;
    flex: none;
    margin-top: 12px;
  }
}
</style>
