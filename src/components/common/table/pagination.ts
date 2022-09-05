import { computed, getCurrentInstance, ref } from 'vue'
import { paginationDefaultConfig } from './table'

export const usePagination = () => {
  const instance = getCurrentInstance()

  const pageNum = ref<number>(1)
  const pageSize = ref<number>(10)
  // 处理分页事件
  const handleSizeChange = (val: number): void => {
    pageSize.value = val

    pageNum.value = 1
  }
  // 处理 页数改变
  const handleCurrentChange = (val: number): void => {
    pageNum.value = val
  }

  // pagination attrs
  const paginationAttrs = computed(() => {
    return {
      ...paginationDefaultConfig,
      layout: paginationDefaultConfig.layout?.join(',')
    }
  })

  return {
    handleSizeChange,
    handleCurrentChange,
    paginationAttrs,
    pageNum,
    pageSize
  }
}
