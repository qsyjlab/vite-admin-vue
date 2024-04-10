import { computed, reactive, ref, toRefs, watch } from 'vue'
import { PaginationProps } from 'element-plus'
import { watchOnce } from '@vueuse/core'
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGINATON_CONFIG } from '../constant'
import { proTableEmits } from '../props'
import { sliceData } from '../utils'

import type { ProTableColumns, ProTableProps } from '../types'

import type { SetupContext } from 'vue'

type IProps = Pick<
  ProTableProps,
  | 'columns'
  | 'data'
  | 'request'
  | 'params'
  | 'pagination'
  | 'loading'
  | 'rowKey'
  | 'transform'
  | 'transformParams'
  | 'autoRequest'
>

type Extra = {
  emits: SetupContext<typeof proTableEmits>['emit']
}

export const useProTable = (props: IProps, extra: Extra) => {
  const { emits } = extra

  const { columns, data, params, pagination } = toRefs(props)

  const { request } = props

  const dataSource = ref<any[]>([])
  const tableColums = computed(() => columnPreConfiguration(columns.value))
  const total = ref(0)
  const loading = ref(false)

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

  watchOnce(
    () => props.pagination,
    () => {
      if (!props.autoRequest) return
      if (typeof pagination.value === 'boolean') {
        refresh()
        return
      } else {
        pageQuery.pageSize = pagination.value.pageSize || DEFAULT_PAGE_SIZE
        refresh()
      }
    },
    {
      immediate: true
    }
  )

  watch([params, data], () => {
    reload()
  })

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
        const response = await request(
          transformParams ? transformParams(mergedParams) : mergedParams
        )
        const { total: _total, data } = transform ? transform(response) : response

        dataSource.value = data
        total.value = _total
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  function setLoading(state: boolean) {
    loading.value = state
    emits('update:loading', loading.value)
  }

  return {
    tableColums,
    paginationProps,
    total,
    loading,
    dataSource,
    pageQuery,
    refresh,
    reload,
    setQueryPageSize,
    setQueryPage
  }
}

// 配置列预设
function columnPreConfiguration(columns: ProTableColumns) {
  const indexBorderColumn = columns.find(col => col.valueType === 'indexBorder')

  if (indexBorderColumn) {
    !indexBorderColumn.title && (indexBorderColumn!.title = '序号')
    !indexBorderColumn.width && (indexBorderColumn!.width = 60)
  }

  return columns
}
