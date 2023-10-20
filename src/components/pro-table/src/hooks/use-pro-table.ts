import { computed, reactive, ref, toRefs, watch } from 'vue'
import { proTableEmits } from '../props'
import { useLoading } from './loading'
import { sliceData } from '../utils'
import { watchOnce } from '@vueuse/core'
import { PaginationProps } from 'element-plus'

import type { ProTableColumns, ProTableProps } from '../types'

import type { SetupContext } from 'vue'

interface IProps
  extends Pick<
    ProTableProps,
    'columns' | 'data' | 'request' | 'params' | 'pagination' | 'loading' | 'rowKey'
  > {
  transform: ProTableProps['transform'][]
  transformParams: ProTableProps['transformParams'][]
}

type Extra = {
  emits: SetupContext<typeof proTableEmits>['emit']
}

const DEFAULT_PAGINATON_CONFIG = {
  pageSizes: [10, 20, 30, 40],
  background: true,
  layout: ['total', 'sizes', 'prev', 'pager', 'next', 'jumper']
}

export const useProTable = (props: IProps, extra: Extra) => {
  const { emits } = extra

  const { columns, data, params, pagination } = toRefs(props)

  const { request } = props

  const dataSource = ref<any[]>([])
  const tableColums = ref(columns.value || [])
  const total = ref(0)
  const pageQuery = reactive<{
    page: number
    pageSize: number
  }>({
    page: 1,
    pageSize: 10
  })

  // 分页相关配置
  const paginationProps = computed<Partial<PaginationProps>>(() => {
    if (typeof pagination.value === 'boolean')
      return {
        ...DEFAULT_PAGINATON_CONFIG,
        currentPage: pageQuery.page,
        total: total.value,
        layout: DEFAULT_PAGINATON_CONFIG.layout?.join(',')
      }
    return {
      ...DEFAULT_PAGINATON_CONFIG,
      ...pagination.value,
      currentPage: pagination.value.page || pageQuery.page,
      total: total.value,
      layout: pagination.value.layout?.join(',') || DEFAULT_PAGINATON_CONFIG.layout?.join(',')
    }
  })

  const { loading, setLoading } = useLoading(props, { emits })

  watchOnce(
    () => props.pagination,
    () => {
      if (typeof pagination.value === 'boolean') {
        refresh()
        return
      }
      pageQuery.pageSize = pagination.value.pageSize || 10

      refresh()
    },
    {
      immediate: true
    }
  )

  watch(
    [params, data],
    () => {
      reload()
    }
    // { deep: }
  )

  const setQueryPage = (page: number) => {
    pageQuery.page = page
    fetchData()
  }

  const setQueryPageSize = (size: number) => {
    pageQuery.page = 1
    pageQuery.pageSize = size

    fetchData()
  }

  function reload() {
    console.log('reload')

    pageQuery.page = 1
    fetchData()
  }

  function refresh() {
    fetchData()
  }

  async function fetchData() {
    setLoading(true)

    try {
      if (!request) {
        dataSource.value = pagination.value
          ? sliceData(data.value, {
              page: pageQuery.page,
              pageSize: pageQuery.pageSize
            })
          : data.value

        total.value = data.value.length
      } else {
        const transform = props.transform
        const transformParams = props.transformParams

        const mergedParams = Object.assign({}, params?.value || {}, pageQuery)
        const response = await request(resolveTransform(mergedParams, transformParams))
        const { total: _total, data } = resolveTransform(response, transform)

        dataSource.value = data
        total.value = _total
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  return {
    paginationProps,
    total,
    loading,
    tableColums: computed(() => columnPreConfiguration(tableColums.value)),
    dataSource,
    pageQuery,
    refresh,
    reload,
    setQueryPageSize,
    setQueryPage
  }
}

function columnPreConfiguration(columns: ProTableColumns) {
  const indexBorderColumn = columns.find(col => col.valueType === 'indexBorder')

  if (indexBorderColumn) {
    indexBorderColumn!.title = '序号'
    indexBorderColumn!.width = 60
  }

  return columns
}

export function resolveTransform(data: any, transformers: ((...args: any[]) => any)[]) {
  if (transformers.length) return data
  let transformedData = data

  for (const transformer of transformers) {
    transformedData = transformer(transformedData)
  }

  return transformedData
}
