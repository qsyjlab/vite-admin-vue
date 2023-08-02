import { computed, nextTick, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { sliceData } from './utils'
import type { SetupContext } from 'vue'
import { proTableEmits, ProTableProps, emitsEnums } from './props'
import { useLoading } from './hooks'
import { ElTable } from 'element-plus'

type UseTableOptions = {
  props: ProTableProps
  emits: SetupContext<typeof proTableEmits>['emit']
}

type TableInstance = InstanceType<typeof ElTable>

interface TableMethods {
  doLayout: TableInstance['doLayout']
}

export const useProTable = (options: UseTableOptions) => {
  const { props, emits } = options

  const { columns, data, request, params = {}, isPagination } = toRefs(props)

  const tableRef = ref<TableInstance | null>(null)

  const dataSource = ref<any[]>([])
  const tableColums = ref(columns.value)
  const total = ref(0)

  const pageQuery = reactive({
    pageNum: 1,
    pageSize: 10
  })

  const { loading, setLoading } = useLoading()

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

  const handleCurrentChange = (val: number) => {
    pageQuery.pageNum = val
    updateTableList()
    emitPagination()
  }

  const handleSizeChange = (val: number) => {
    pageQuery.pageNum = 1
    pageQuery.pageSize = val

    emitPagination()
    updateTableList()
  }

  function reload() {
    pageQuery.pageNum = 1
    updateTableList()
    isPagination && emitPagination()
  }

  function refresh() {
    updateTableList()
  }

  async function updateTableList() {
    setLoading(true)

    try {
      if (!request?.value) {
        dataSource.value = isPagination
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

  function doLayout() {
    nextTick(() => {
      tableRef.value?.doLayout()
    })
  }

  const tableMethods: TableMethods = {
    doLayout
  }

  return {
    tableRef,
    tableMethods,
    total,
    loading,
    tableColums,
    dataSource,
    pageQuery,
    refresh,
    reload,
    handleSizeChange,
    handleCurrentChange
  }
}
