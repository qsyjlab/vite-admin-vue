import { reactive, ref } from 'vue'
import { createContext, useContext } from '@/hooks/core/use-context'
import { useColumnsMap, useProTable, useEditable, useSelection } from '../hooks'

import type { TableInstance } from 'element-plus'
import type { ProTableEmits, ProTableProps } from '../props'
import type { TableActionRef } from '../types'
import type { InjectionKey, SetupContext } from 'vue'

interface IExtraOptions {
  emits: SetupContext<ProTableEmits>['emit']
}

type ITableProps = Pick<ProTableProps, 'size'>

export function useTableStore(props: ProTableProps, options: IExtraOptions) {
  const { emits } = options

  const tableInstanceRef = ref<TableInstance | null>(null)

  const tableProps = reactive<ITableProps>({
    size: 'default'
  })

  const {
    paginationProps,
    dataSource,
    total,
    pageQuery,
    loading,
    tableColums,
    reload,
    refresh,
    setQueryPage,
    setQueryPageSize
  } = useProTable(props, { emits })

  const { selectedKeys, setSelectedKeys, clearSelectedKeys } = useSelection(props, {
    tableInstance: tableInstanceRef,
    emits
  })

  const {
    startEditable,
    cancelEditable,
    saveEditRow,
    deleteEditRow,
    editableCellMap,
    clearEditRow,
    clearValidateErrors,
    hasEditingRow
  } = useEditable({
    dataSource,
    rowKey: props.rowKey,
    editableConfig: props.editable,
    columns: props.columns
  })

  const {
    defaultColumnsMap,
    columnsMap,
    setDefaultColumnsMap,
    mergeColumnsMap,
    resetColumnsMap,
    getColumnMapConfig,
    initLocalStorageOrDynamicMap
  } = useColumnsMap({
    columnsState: props.columnsState
  })

  /** 编辑列相关函数 */
  const editableCellUtils = {
    startEditable,
    cancelEditable,
    saveEditRow,
    deleteEditRow,
    clearEditRow,
    hasEditingRow,
    clearValidateErrors
  }

  /** 列设置相关 */
  const columnsSettingUtils = {
    setDefaultColumnsMap,
    mergeColumnsMap,
    resetColumnsMap,
    getColumnMapConfig,
    initLocalStorageOrDynamicMap
  }

  function clearSelection() {
    tableInstanceRef.value?.clearSelection()
  }

  function toggleRowSelection(row: any, selected: boolean) {
    tableInstanceRef.value?.toggleRowSelection(row, selected)
  }

  function mergeTableProps(props: ITableProps) {
    Object.assign(tableProps, props)
  }

  /**
   * expose ref
   *
   */
  const tableActionRef: TableActionRef = {
    tableRef: tableInstanceRef,
    emits,
    reload,
    refresh,
    clearSelection,
    toggleRowSelection,
    editableCellUtils,
    columnsSettingUtils
  }

  return {
    paginationProps,
    tableProps,
    loading,
    selectedKeys,
    total,
    pageQuery,
    dataSource,
    tableColums,
    defaultColumnsMap,
    columnsMap,
    reload,
    setQueryPage,
    setQueryPageSize,
    setSelectedKeys,
    clearSelectedKeys,
    tableActionRef,
    tableInstanceRef,
    mergeTableProps,
    editableCellMap,
    editableCellUtils,
    columnsSettingUtils
  }
}

const contextKey: InjectionKey<TableStore> = Symbol()

type TableStore = ReturnType<typeof useTableStore>

export function createTableStoreContext(context: TableStore) {
  return createContext(context, contextKey, { readonly: false, native: true })
}

export function useTableStoreContext() {
  return useContext(contextKey)
}
