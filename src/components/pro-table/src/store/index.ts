import { reactive, ref, unref } from 'vue'
import { createContext, useContext } from '@/hooks/core/use-context'
import { useColumnsMap, useProTable, useEditable } from '../hooks'

import type { TableInstance } from 'element-plus'
import type { ProTableEmits, ProTableProps } from '../props'
import type { ColumnsState, ProTableEditable, TableActionRef } from '../types'
import type { InjectionKey, SetupContext } from 'vue'

interface IProps {
  columnsState: ColumnsState
  rowKey: string
  editableConfig: ProTableEditable
}

interface IExtraOptions {
  emits: SetupContext<ProTableEmits>['emit']
}

type ITableProps = Pick<ProTableProps, 'size'>

export function useTableStore(
  props: IProps & Omit<ProTableProps, 'editable'>,
  options: IExtraOptions
) {
  const { emits } = options
  const proTableProps = unref(props)

  const tableInstanceRef = ref<TableInstance | null>(null)

  const tableProps = reactive<ITableProps>({
    size: 'default'
  })

  const {
    dataSource,

    total,
    pageQuery,
    loading,
    tableColums,
    reload,
    refresh,
    handleSizeChange,
    handleCurrentChange,
    selectedKeys,
    setSelectedKeys,
    clearSelectedKeys
  } = useProTable(props, { emits, tableInstanceRef })

  const {
    startEditable,
    cancelEditable,
    saveEditRow,
    deleteEditRow,
    editableCellMap,
    clearEditRow,
    clearValidateErrors
  } = useEditable({
    dataSource,
    rowKey: proTableProps.rowKey,
    editableConfig: proTableProps.editableConfig,
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
    columnsState: proTableProps.columnsState
  })

  /** 编辑列相关函数 */
  const editableCellUtils = {
    startEditable,
    cancelEditable,
    saveEditRow,
    deleteEditRow,
    clearEditRow,
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
    emits,
    reload,
    refresh,
    clearSelection,
    toggleRowSelection,
    editableCellUtils,
    columnsSettingUtils
  }

  return {
    loading,
    tableColums,
    handleSizeChange: (val: number) => {
      clearEditRow()
      handleSizeChange(val)
    },
    handleCurrentChange: (val: number) => {
      clearEditRow()
      handleCurrentChange(val)
    },
    selectedKeys,
    setSelectedKeys,
    clearSelectedKeys,
    reload,
    total,
    pageQuery,
    dataSource,
    tableActionRef,
    tableInstanceRef,
    /** 一下方法可能都会被合并到  tableActionRef 中 统一控制 */
    editableCellMap,
    editableCellUtils,
    columnsSettingUtils,
    tableProps,
    defaultColumnsMap,
    setDefaultColumnsMap,
    columnsMap,
    mergeColumnsMap,
    mergeTableProps,
    resetColumnsMap,
    getColumnMapConfig,
    initLocalStorageOrDynamicMap
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
