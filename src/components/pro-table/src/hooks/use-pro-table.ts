import { reactive, ref, toRefs, watch } from 'vue'
import type { Ref, SetupContext } from 'vue'
import { proTableEmits, ProTableProps, emitsEnums } from '../props'
import { useLoading } from './loading'
import type { TableInstance, TableExpose } from '../types'
import { useSelection } from './use-selection'
import { useTableStoreContext } from '../store'

export function sliceData(data: any, { pageNum = 1, pageSize = 10 }) {
  const start = (pageNum - 1) * pageSize
  return data.slice(start, start + pageSize)
}

type IProps = Pick<
  ProTableProps,
  'columns' | 'data' | 'request' | 'params' | 'pagination' | 'loading' | 'rowKey' | 'selectedKeys'
>

type Extra = {
  emits: SetupContext<typeof proTableEmits>['emit']
  tableInstanceRef: Ref<TableInstance | null>
}

export const useProTable = (props: IProps, extra: Extra) => {
  const { emits, tableInstanceRef } = extra

  const { columns, data, request, params = {}, pagination } = toRefs(props)

  const dataSource = ref<any[]>([])
  const tableColums = ref(columns.value || [])
  const total = ref(0)

  const pageQuery = reactive({
    pageNum: 1,
    pageSize: 10
  })

  const { loading, setLoading } = useLoading(props, { emits })

  const { selectedKeys, setSelectedKeys, clearSelectedKeys } = useSelection(props, {
    tableInstance: tableInstanceRef,
    emits
  })

  watch(
    [params, data],
    () => {
      reload()
    },
    {
      deep: true,
      immediate: true
    }
  )

  /**
   * TODO: 分页暂时放这里 后期迁移至外部，
   * 独立出 数据处理部分，让外部的分页来驱动数据
   */

  const handleCurrentChange = (val: number) => {
    pageQuery.pageNum = val

    fetchData()
    emitPagination()
  }

  const handleSizeChange = (val: number) => {
    pageQuery.pageNum = 1
    pageQuery.pageSize = val

    emitPagination()
    fetchData()
  }

  function reload() {
    pageQuery.pageNum = 1
    fetchData()
    pagination && emitPagination()
  }

  function refresh() {
    fetchData()
  }

  async function fetchData() {
    setLoading(true)

    try {
      if (!request?.value) {
        dataSource.value = pagination
          ? sliceData(data.value, {
              pageNum: pageQuery.pageNum,
              pageSize: pageQuery.pageSize
            })
          : data.value

        total.value = data.value.length
      } else {
        const { data, total = 0 } = await request.value(Object.assign({}, params, pageQuery))

        dataSource.value = data
        total.value = total
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  function emitPagination() {
    emits(emitsEnums.PAGE_CHANGE, pageQuery.pageNum, pageQuery.pageSize)
  }

  return {
    total,
    loading,
    tableColums,
    dataSource,
    pageQuery,
    refresh,
    reload,
    handleSizeChange,
    handleCurrentChange,
    selectedKeys,
    setSelectedKeys,
    clearSelectedKeys
  }
}
