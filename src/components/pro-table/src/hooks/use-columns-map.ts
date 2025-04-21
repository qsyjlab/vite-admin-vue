import { ref, watch, toRaw } from 'vue'
import type { ColumnsMap, ColumnsState } from '../types'

interface IProps {
  columnsState: ColumnsState
}

export function useColumnsMap(props: IProps) {
  const columnsMap = ref<Record<string, any>>({})

  const defaultColumnsMap = ref<Record<string, any> | null>(null)
  watch(
    [() => props.columnsState],
    () => {
      mergeColumnsMap(props.columnsState?.value || {})
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
    columnsMap,
    defaultColumnsMap,
    mergeColumnsMap,
    resetColumnsMap,
    setDefaultColumnsMap,
    getColumnMapConfig,
    initLocalStorageOrDynamicMap
  }
}

export type UseColumnsMapReturn = ReturnType<typeof useColumnsMap>
