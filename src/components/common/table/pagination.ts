/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-01-10 11:05:21
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 17:37:08
 */

import { computed, getCurrentInstance, ref } from 'vue'
import { paginationDefaultConfig } from './table'

export const usePagination = () => {
  const instance = getCurrentInstance()
  console.log('instance', instance)

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
