<template>
  <div
    ref="wrapperRef"
    class="pro-table"
    :class="{
      'is-auto-fit': autoFitHeight,
      'is-drag-sort': Boolean(resolvedDragSort),
      'is-drag-sort-ready': dragSortReady,
      'has-drag-handle': Boolean(resolvedDragSort?.handleColumnKey)
    }"
  >
    <div
      v-if="showToolbar || $slots.headerTitle || $slots.toolbar"
      ref="toolbarRef"
      class="pro-table__toolbar"
    >
      <div class="pro-table__title">
        <slot name="headerTitle">{{ headerTitle }}</slot>
      </div>
      <div class="pro-table__actions">
        <slot name="toolbar" />
        <el-tooltip v-if="toolbarOptions.reload" content="刷新" placement="top">
          <el-button text circle :icon="RefreshRight" @click="refresh" />
        </el-tooltip>
        <el-dropdown
          v-if="toolbarOptions.density"
          trigger="click"
          :popper-class="resolvedPopperClass"
          @command="setTableSize"
        >
          <el-button text circle :icon="Operation" aria-label="表格密度" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="large">宽松</el-dropdown-item>
              <el-dropdown-item command="default">默认</el-dropdown-item>
              <el-dropdown-item command="small">紧凑</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-popover
          v-if="toolbarOptions.setting"
          placement="bottom-end"
          :width="320"
          trigger="click"
          :popper-class="resolvedPopperClass"
        >
          <template #reference>
            <el-button text circle :icon="Setting" aria-label="列设置" />
          </template>
          <pro-table-column-setting
            :columns="configurableColumns"
            :column-state="columnStateMap"
            @reset="resetColumnState"
            @visible-change="setColumnVisible"
            @fixed-change="setColumnFixed"
            @reorder="reorderColumns"
          />
        </el-popover>
      </div>
    </div>

    <div
      v-if="showAlert && (alwaysShowAlert || selectedKeyList.length)"
      ref="alertRef"
      class="pro-table__alert"
    >
      <slot name="alert" :selected-keys="selectedKeyList" :selected-rows="getSelectedRows()">
        <el-alert type="info" show-icon :closable="false">
          <template #title>
            已选择 {{ selectedKeyList.length }} 项
            <el-button type="primary" link @click="clearSelection">取消全部</el-button>
          </template>
        </el-alert>
      </slot>
    </div>

    <el-alert
      v-if="requestError && tableData.length"
      class="pro-table__request-error"
      type="error"
      :title="resolvedRequestErrorText"
      :closable="false"
      show-icon
    >
      <template #default>
        <el-button type="danger" link @click="handleRetryRequest">{{ retryText }}</el-button>
      </template>
    </el-alert>

    <div class="pro-table__body">
      <el-table
        ref="tableRef"
        v-bind="$attrs"
        v-loading="mergedLoading"
        :data="tableData"
        :height="tableHeight"
        :row-key="resolvedRowKey"
        :border="resolvedBorder"
        :size="currentSize"
        :table-layout="tableLayout"
        @selection-change="handleSelectionChange"
        @sort-change="handleTableSortChange"
        @filter-change="handleTableFilterChange"
      >
        <el-table-column
          v-if="checkable"
          type="selection"
          width="44"
          :reserve-selection="reserveSelection"
        />
        <pro-table-column
          v-for="column in visibleColumns"
          :key="getProTableColumnKey(column)"
          :column="column"
          :table-slots="$slots"
          :get-editable-state="getRowState"
          :update-editable-value="updateEditableValue"
          :custom-render-after="resolvedCustomRenderAfter"
          :drag-handle="isDragHandleColumn(column)"
        />
        <template #empty>
          <slot
            name="empty"
            :status="emptyStatus"
            :error="requestError"
            :retry="handleRetryRequest"
          >
            <pro-empty
              :status="emptyStatus"
              :title="resolvedEmptyTitle"
              :description="resolvedEmptyDescription"
              :action-text="requestError ? retryText : undefined"
              compact
              @action="handleRetryRequest"
            />
          </slot>
        </template>
      </el-table>
    </div>

    <div v-if="pagination" ref="paginationRef" class="pro-table__pagination">
      <el-pagination
        :current-page="pageInfo.current"
        :page-size="pageInfo.pageSize"
        :total="total"
        :page-sizes="paginationProps.pageSizes"
        :layout="paginationProps.layout"
        :background="paginationProps.background"
        :small="paginationProps.small"
        :popper-class="paginationProps.popperClass"
        :teleported="paginationProps.teleported"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="
    TRecord extends object = Record<string, unknown>,
    TQuery extends object = Record<string, unknown>,
    TResponse = ProTableRequestResult<TRecord>
  "
>
import { computed } from 'vue'
import { Operation, RefreshRight, Setting } from '@element-plus/icons-vue'
import ProEmpty from '../pro-empty/pro-empty.vue'
import { useProConfigProvider } from '../pro-config-provider/pro-config-provider-context'
import { resolveProConfigProviderPopperClass } from '../pro-config-provider/pro-config-provider-utils'
import ProTableColumnSetting from './components/pro-table-column-setting.vue'
import { ProTableColumnRenderer as ProTableColumn } from './components/pro-table-column'
import { getProTableColumnKey } from './pro-table-utils'
import { useProTableStore, type ProTableStoreEmitMap } from './store'
import type { ProTableProps, ProTableRequestResult } from './pro-table'

defineOptions({
  name: 'ProTable',
  inheritAttrs: false
})

const props = withDefaults(defineProps<ProTableProps<TRecord, TQuery, TResponse>>(), {
  data: () => [],
  params: () => ({}) as TQuery,
  pagination: true,
  autoRequest: true,
  rowKey: 'id',
  checkable: false,
  reserveSelection: false,
  selectedKeys: () => [],
  cacheSelectedData: () => [],
  options: true,
  columnsState: () => ({}),
  indexBorder: true,
  showAlert: true,
  alwaysShowAlert: false,
  autoFitHeight: false,
  border: true,
  tableLayout: 'fixed'
})
const emit = defineEmits<ProTableStoreEmitMap<TRecord>>()
defineSlots<Record<string, (scope?: any) => unknown>>()
const proConfig = useProConfigProvider()
const store = useProTableStore({ props, emit, proConfig })
const {
  wrapperRef,
  toolbarRef,
  alertRef,
  paginationRef,
  tableRef,
  currentSize,
  showToolbar,
  resolvedCustomRenderAfter,
  resolvedRowKey,
  setTableSize,
  tableData,
  total,
  pageInfo,
  mergedLoading,
  requestError,
  paginationProps,
  refresh,
  handleCurrentChange,
  handleSizeChange,
  columnStateMap,
  visibleColumns,
  configurableColumns,
  toolbarOptions,
  setColumnVisible,
  reorderColumns,
  setColumnFixed,
  resetColumnState,
  getRowState,
  updateEditableValue,
  selectedKeyList,
  handleSelectionChange,
  handleTableSortChange,
  handleTableFilterChange,
  clearSelection,
  getSelectedRows,
  tableHeight,
  resolvedDragSort,
  dragSortReady,
  isDragHandleColumn
} = store
const resolvedBorder = computed(() => props.border ?? proConfig.value.table?.border ?? true)
const retryText = computed(() => props.retryText ?? '重试')
const resolvedRequestErrorText = computed(() => {
  if (typeof props.errorText === 'function') return props.errorText(requestError.value)
  if (props.errorText) return props.errorText
  if (requestError.value instanceof Error && requestError.value.message) {
    return requestError.value.message
  }
  return '数据加载失败，请稍后重试'
})
const hasQueryState = computed(
  () =>
    Object.keys(props.params ?? {}).length > 0 ||
    Boolean(store.sorter.value) ||
    Object.values(store.filters.value).some(values => values.length > 0)
)
const emptyStatus = computed(() =>
  requestError.value ? 'error' : hasQueryState.value ? 'search' : 'empty'
)
const resolvedEmptyTitle = computed(() => {
  if (requestError.value) return '加载失败'
  return props.emptyText
})
const resolvedEmptyDescription = computed(() =>
  requestError.value ? resolvedRequestErrorText.value : undefined
)
const resolvedPopperClass = computed(() =>
  resolveProConfigProviderPopperClass(proConfig.value.dark)
)

async function handleRetryRequest() {
  try {
    await store.retryRequest()
  } catch {
    return
  }
}

defineExpose(store.exposed)
</script>

<style scoped lang="scss">
.pro-table {
  display: flex;
  min-width: 0;
  flex-direction: column;
  color: var(--el-text-color-primary);

  &.is-auto-fit {
    height: 100%;
    min-height: 0;
    flex: 1 1 auto;
  }

  &.is-drag-sort:not(.has-drag-handle) {
    :deep(.el-table__body-wrapper tbody tr) {
      cursor: move;
    }
  }

  :deep(.pro-table-drag-handle) {
    display: inline-flex;
    min-width: 0;
    align-items: center;
    gap: 8px;
  }

  :deep(.pro-table-drag-handle__icon) {
    flex: none;
    color: var(--el-text-color-secondary);
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  &__toolbar {
    display: flex;
    min-height: 48px;
    flex: none;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 8px 0;
  }

  &__title {
    min-width: 0;
    color: var(--el-text-color-primary);
    font-size: var(--el-font-size-large);
    font-weight: 600;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  &__alert {
    flex: none;
    padding-bottom: 12px;
  }

  &__request-error {
    flex: none;
    margin-bottom: 12px;
  }

  &__body {
    min-width: 0;
    min-height: 0;
    flex: 1;
  }

  &__pagination {
    display: flex;
    flex: none;
    justify-content: flex-end;
    padding-top: 16px;
    overflow-x: auto;
  }
}

:global(.pro-table-column-header) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

:global(.pro-table-column-header__tip) {
  color: var(--el-text-color-secondary);
  cursor: help;
}

:global(.pro-table-editable-cell) {
  width: 100%;
}

:global(.pro-table-editable-cell__error) {
  margin-top: 4px;
  color: var(--el-color-danger);
  font-size: var(--el-font-size-extra-small);
  line-height: 1.25;
}

:global(.pro-table-editable-cell.is-error .el-input__wrapper),
:global(.pro-table-editable-cell.is-error .el-select__wrapper) {
  box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}
</style>
