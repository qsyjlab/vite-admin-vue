import { computed, inject, nextTick, reactive, ref, toRefs, watch, onMounted, toRef } from 'vue'
import { createContext, useContext } from '@/hooks/core/use-context'
import { useColumnsMap, useProTable, useEditable, useSelection } from '../hooks'

import type { TableInstance } from 'element-plus'
import type { ProTableEmits } from '../props'
import type { TableActionRef, ProTableProps } from '../types'
import type { ComponentInternalInstance, InjectionKey, SetupContext } from 'vue'
import { proConfigProviderContextKey } from '@/components/pro-config-provider/src/token'
import type { ProConfigProviderProps } from '@/components/pro-config-provider'

interface IExtraOptions {
  emits: SetupContext<ProTableEmits>['emit']
}

type ITableProps = Pick<ProTableProps, 'size' | 'height'>

export function useTableStore(
  props: ProTableProps & { size?: ITableProps['size'] },
  options: IExtraOptions
) {
  const { emits } = options

  const tableInstanceRef = ref<TableInstance | null>(null)

  const proTableWrapperRef = ref<Nullable<HTMLDivElement>>(null)
  const proTableWrapperHeight = ref<number>(0)

  const paginationRef = ref<Nullable<HTMLDivElement>>(null)

  const toolbarRef = ref<Nullable<HTMLDivElement>>(null)
  const alertRef = ref<Nullable<HTMLDivElement>>(null)

  // 表格实例属性
  const tableProps = reactive<ITableProps>({
    size: 'default',
    height: 0
  })

  // 全局共享读取的属性
  const sharedProperties = computed(() => {
    return {
      enableValidate: props.editable.enableValidate
    }
  })

  let proTableConfig: ProConfigProviderProps['proTable'] | undefined

  try {
    const { proTable } = inject(proConfigProviderContextKey, {})
    proTableConfig = proTable
  } catch (error) {}

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
  } = useProTable(
    reactive({
      ...toRefs(props),
      transform: props.transform || proTableConfig?.transform,
      transformParams: props.transformParams || proTableConfig?.transformParams
    }),
    { emits }
  )

  const { cacheSelectedData, selectedKeys, setSelectedKeys, clearSelectedKeys } = useSelection(
    {
      dataSource,
      selectedKeys: toRef(props, 'selectedKeys'),
      cacheSelectedData: toRef(props, 'cacheSelectedData'),
      rowKey: props.rowKey
    },
    {
      tableInstance: tableInstanceRef,
      emits
    }
  )

  const {
    startEditable,
    cancelEditable,
    saveEditable,
    deleteEditable,
    editableCellMap,
    clearEditRow,
    clearValidateErrors,
    hasEditingRow,
    setFormInstanceRef,
    editableRowsModel,
    getRowEditableState
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
    saveEditable,
    deleteEditable,
    clearEditRow,
    hasEditingRow,
    setFormInstanceRef,
    getRowEditableState,
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

  if (props.autoFitHeight) {
    onMounted(() => {
      nextTick(() => {
        /**
         * 已知问题 , 页面存在过度动画过着 包裹着的父级元素过度 会导致表格获取不到高度
         */
        proTableWrapperHeight.value = proTableWrapperRef.value?.clientHeight || 0
        watch(
          [proTableWrapperRef, alertRef, toolbarRef, paginationRef, selectedKeys],
          () => {
            nextTick(() => {
              doHeight()
            })
          },
          {
            immediate: true,
            flush: 'post'
          }
        )
      })
    })
  } else {
    doHeight()
  }

  function doHeight() {
    if (props.height) {
      tableProps.height = props.height
      return
    }
    if (!props.autoFitHeight) {
      tableProps.height = undefined

      return
    }

    let height = proTableWrapperHeight.value

    if (!height) return 0

    if (toolbarRef.value) {
      height -= toolbarRef.value.offsetHeight
    }

    if (alertRef.value && selectedKeys.value.length) {
      height -= alertRef.value.offsetHeight
    }
    if (paginationRef.value) {
      height -= paginationRef.value.clientHeight
    }

    tableProps.height = height - 5
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
    doHeight,
    reload,
    refresh,
    clearSelectedKeys,
    editableCellUtils,
    columnsSettingUtils
  }

  return {
    doHeight,
    toolbarRef,
    alertRef,
    paginationRef,
    proTableWrapperRef,
    sharedProperties,
    paginationProps,
    tableProps,
    loading,
    selectedKeys,
    cacheSelectedData,
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
    customRendererMap: proTableConfig?.rendererMap,
    customRenderAfter: props.customRenderAfter || proTableConfig?.customRenderAfter,
    editableCellMap,
    editableRowsModel,
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

const proTableInstanceKey: InjectionKey<ComponentInternalInstance> = Symbol()

export function createProtableInstanceContext(context: ComponentInternalInstance) {
  return createContext(context, proTableInstanceKey, { readonly: false })
}

export function useProtableInstanceContext() {
  return useContext(proTableInstanceKey)
}
