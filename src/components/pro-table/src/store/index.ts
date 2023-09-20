import { reactive, ref, toRaw, watch } from 'vue'

import type { InjectionKey, Ref } from 'vue'
import { createContext, useContext } from '@/hooks/core/use-context'
import type { ColumnsState, ColumnsMap, TableExpose, ProTableEditable } from '../types'
import { ProTableProps } from '../props'
import { useEditable } from '../hooks/use-editable'
interface IProps {
  columnsState: ColumnsState
  dataSource: Ref<any>
  rowKey: string
  editableConfig: ProTableEditable
}

type ITableProps = Pick<ProTableProps, 'size'>

export function useTableStore(props: IProps) {
  const sortColumnKeys: string[] = []

  const columnsMap = ref<Record<string, any>>({})

  const defaultColumnsMap = ref<Record<string, any> | null>(null)

  const tableProps = reactive<ITableProps>({
    size: 'default'
  })

  const { startEditable, cancelEditable, saveEditRow, deleteEditRow, editableCellMap } =
    useEditable({
      dataSource: props.dataSource,
      rowKey: props.rowKey,
      editableConfig: props.editableConfig
    })

  const editableCellUtils = {
    startEditable,
    cancelEditable,
    saveEditRow,
    deleteEditRow
  }

  watch(
    [() => props.columnsState],
    () => {
      mergeColumnsMap(props.columnsState.value || {})
    },
    {
      deep: true,
      immediate: true
    }
  )

  watch(
    columnsMap,
    newVal => {
      persistence().set(toRaw({ ...newVal }))
    },
    {
      deep: true
    }
  )

  function initLocalStorageOrDynamicMap(map: any) {
    const localMap = persistence().get()
    // 如果缓存中存在数据优先使用缓存数据
    if (Object.keys(localMap).length) {
      mergeColumnsMap(localMap)
    } else {
      mergeColumnsMap(map)
    }
  }

  function persistence() {
    const { persistenceKey, persistenceType = 'localStorage' } = props.columnsState
    const storage = window[persistenceType]

    return {
      set: (value: Record<string, any>) => {
        if (persistenceKey && persistenceType) {
          storage.setItem(persistenceKey, JSON.stringify(value))
        }
      },
      remove: () => {
        if (persistenceKey && persistenceType) {
          storage.removeItem(persistenceKey)
        }
      },
      get: (): ColumnsMap => {
        try {
          if (persistenceKey && persistenceType) {
            return JSON.parse(storage.getItem(persistenceKey) || '')
          }

          return {}
        } catch (error) {
          return {}
        }
      }
    }
  }

  function mergeTableProps(props: ITableProps) {
    Object.assign(tableProps, props)
  }

  function setSortColumnKeys(keys: string[]) {
    return []
  }

  function setDefaultColumnsMap(map: Record<string, any>) {
    defaultColumnsMap.value = { ...map }
  }

  function mergeColumnsMap(map: Record<string, any>) {
    columnsMap.value = Object.assign({}, columnsMap.value, map)
  }

  // reset 重置策略为 传入的配置加上默认的配置
  function resetColumnsMap() {
    columnsMap.value = { ...defaultColumnsMap.value }
    persistence().remove()
  }

  function getColumnMapConfig(key: string) {
    return columnsMap.value[key] || { show: true }
  }

  return {
    editableCellMap,
    editableCellUtils,

    tableProps,
    sortColumnKeys,
    defaultColumnsMap,
    setDefaultColumnsMap,
    columnsMap,
    mergeColumnsMap,
    mergeTableProps,
    resetColumnsMap,
    setSortColumnKeys,
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

// 共享 table 实例到子集
export const tableActionKey: InjectionKey<TableExpose> = Symbol()

// 共享 action
export function createTableAction(actions: TableExpose) {
  return createContext(actions, tableActionKey, { readonly: true })
}

export function useTableActionContext() {
  return useContext(tableActionKey)
}
