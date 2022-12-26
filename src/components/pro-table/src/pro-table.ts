import { computed, reactive, ref, toRefs, watch } from 'vue'
import { sliceData } from './utils'
import type { SetupContext } from 'vue'
import { proTableEmits, ProTableProps, emitsEnums } from './props'

type UseTableOptions = {
  props: ProTableProps
  emits: SetupContext<typeof proTableEmits>['emit']
}

export const useTable = (options: UseTableOptions) => {
  const { props, emits } = options

  const { columns, data, request, params = {}, isPagination } = toRefs(props)

  const dataSource = ref<any[]>([])
  const tableColums = computed(() => columns.value)
  const total = ref(0)

  const pageQuery = reactive({
    pageNum: 1,
    pageSize: 10
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
    } catch (error) {
      console.error(error)
    }
  }

  function emitPagination() {
    emits(emitsEnums.PAGE_CHANGE, pageQuery.pageNum, pageQuery.pageSize)
  }

  return {
    total,
    tableColums,
    dataSource,
    pageQuery,
    refresh,
    reload,
    handleSizeChange,
    handleCurrentChange
  }
}
