import { computed, reactive, ref, watch, ComputedRef } from 'vue'
import type { FormSchema } from './types/form'
import type { ColProps } from 'element-plus'

interface CollapseOption {
  model: Record<string, any>
  isWatch: boolean
  fields: ComputedRef<FormSchema[]>
  alwaysShowLines?: number
  autoAdvancedLine?: number
}

export function useCollapse(option: CollapseOption) {
  const { fields, isWatch = true } = option

  const fieldsIsCollapsedMap = reactive<Record<string, boolean>>({})

  const BASIC_COL_LEN = 24

  // 最后一行的剩余宽度
  const lastRowSpaceSpan = ref(0)
  const rowNum = ref(0)

  const advanceState = reactive<{
    isAdvanced: boolean
    hideAdvanceBtn: boolean
    span: number
  }>({
    isAdvanced: true,
    hideAdvanceBtn: false,
    span: 5
  })

  if (isWatch) {
    watch(
      [fields, () => advanceState.isAdvanced],
      () => {
        updateCollapce()
      },
      {
        immediate: true,
        deep: true
      }
    )
  }

  const advancedSpanColAttrs = computed<Partial<ColProps>>(() => {
    const spaceSpan =
      advanceState.span > lastRowSpaceSpan.value ? BASIC_COL_LEN : lastRowSpaceSpan.value

    return {
      span: advanceState.span,
      offset: spaceSpan < advanceState.span ? 0 : spaceSpan - advanceState.span
    }
  })

  function toggleCollapse() {
    advanceState.isAdvanced = !advanceState.isAdvanced
  }

  function updateCollapce() {
    lastRowSpaceSpan.value = 0

    let totalSpan = 0
    // 当前行总 span
    let curRowSpan = 0

    if (!advanceState.isAdvanced) {
      curRowSpan += advanceState.span
      totalSpan += advanceState.span
    }

    rowNum.value++

    fields.value.forEach(item => {
      const colSpan = item.col?.span || BASIC_COL_LEN
      curRowSpan += colSpan

      // 计算目前剩余空格
      const curRowSpaceSpan = BASIC_COL_LEN - curRowSpan

      // 不足空格 下一行
      if (curRowSpaceSpan < 0) {
        rowNum.value++
        curRowSpan = colSpan
      }
      const hidden =
        !advanceState.isAdvanced && (totalSpan > 24 || curRowSpaceSpan + colSpan < colSpan)

      fieldsIsCollapsedMap[item.key] = !hidden
      totalSpan += colSpan
    })

    lastRowSpaceSpan.value = BASIC_COL_LEN - curRowSpan

    if (!advanceState.isAdvanced) {
      const shouldShowFields: { span: number }[] = fields.value
        .filter(i => fieldsIsCollapsedMap[i.key])
        .map(i => ({ span: i.col?.span || BASIC_COL_LEN }))

      let tCols = 0
      shouldShowFields.forEach(({ span }) => {
        tCols += span
      })
      if (tCols >= BASIC_COL_LEN) {
        lastRowSpaceSpan.value = 0
      } else {
        lastRowSpaceSpan.value = BASIC_COL_LEN - tCols
      }
    }

    if (rowNum.value <= 1) {
      advanceState.hideAdvanceBtn = true
    } else {
      advanceState.hideAdvanceBtn = false
    }
  }

  return {
    fieldsIsCollapsedMap,
    toggleCollapse,
    updateCollapce,
    advanceState,
    advancedSpanColAttrs
  }
}
