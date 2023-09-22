import { computed, reactive, ref, toRefs, watch, watchEffect } from 'vue'
import { proTableEmits, ProTableProps } from '../props'
import { useLoading } from './loading'
import { sliceData } from '../utils'

import type { SetupContext } from 'vue'
import { watchOnce } from '@vueuse/core'
import { PaginationProps } from 'element-plus'

type IProps = Pick<
  ProTableProps,
  'columns' | 'data' | 'request' | 'params' | 'pagination' | 'loading' | 'rowKey'
>

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

  const { columns, data, request, params, pagination } = toRefs(props)

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
      if (typeof pagination.value === 'boolean') return
      pageQuery.pageSize = pagination.value.pageSize || 10

      if (pageQuery.page !== pagination.value.page) {
        pageQuery.page = pagination.value.page || 1
        refresh()
      }
    }
  )

  watch([params, data], () => {
    refresh()
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
    console.log('refresh')

    fetchData()
  }

  async function fetchData() {
    setLoading(true)

    try {
      if (!request?.value) {
        dataSource.value = pagination
          ? sliceData(data.value, {
              page: pageQuery.page,
              pageSize: pageQuery.pageSize
            })
          : data.value

        total.value = data.value.length
      } else {
        const { data, total: _total = 0 } = await request.value(
          Object.assign({}, params?.value || {}, pageQuery)
        )

        console.log('data, total', data, total)

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
    tableColums,
    dataSource,
    pageQuery,
    refresh,
    reload,
    setQueryPageSize,
    setQueryPage
  }
}
