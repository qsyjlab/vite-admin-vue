import { computed, reactive, ref, watch } from 'vue'
import type { FormSchema } from './types/form'
import type { ColProps } from 'element-plus'

interface CollapseOption {
  isWatch: boolean
  fields: FormSchema[]
  alwaysShowLines?: number
  autoAdvancedLine?: number
}

export function useCollapse(option: CollapseOption) {
  const { fields, isWatch } = option

  const fieldsIsCollapsedMap = reactive<Record<string, boolean>>({})

  const BASIC_COL_LEN = 24

  // 最后一行的剩余宽度
  const lastRowSpaceSpan = ref(0)

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
      [() => fields, () => advanceState.isAdvanced],
      () => {
        updateCollapce()
      },
      {
        immediate: true,
        deep: true
      }
    )
  }

  /**
   * TODO: 期望值action col 能与最后一行平级 在有空余的情况下
   *  show 控制函数加入
   */
  const advancedSpanColAttrs = computed<Partial<ColProps>>(() => {
    return {
      span: advanceState.span > lastRowSpaceSpan.value ? BASIC_COL_LEN : advanceState.span,
      offset:
        advanceState.span > lastRowSpaceSpan.value ? 0 : lastRowSpaceSpan.value - advanceState.span
    }
  })

  function toggleCollapse() {
    advanceState.isAdvanced = !advanceState.isAdvanced
  }

  function updateCollapce() {
    lastRowSpaceSpan.value = 0

    let totalSpan = 0

    if (!advanceState.isAdvanced) {
      lastRowSpaceSpan.value += advanceState.span
      totalSpan += advanceState.span
    }

    fields.forEach(item => {
      const colSpan = item.col?.span || BASIC_COL_LEN
      lastRowSpaceSpan.value += colSpan

      const curRowSpaceSpan = BASIC_COL_LEN - lastRowSpaceSpan.value

      if (curRowSpaceSpan <= 0) {
        lastRowSpaceSpan.value = 0
        lastRowSpaceSpan.value += colSpan
      }
      const hidden =
        !advanceState.isAdvanced && (totalSpan > 24 || curRowSpaceSpan + colSpan < colSpan)

      fieldsIsCollapsedMap[item.key] = !hidden
      totalSpan += colSpan
    })

    if (!advanceState.isAdvanced) {
      const shouldShowFields: { span: number }[] = fields
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
  }

  return {
    fieldsIsCollapsedMap,
    toggleCollapse,
    updateCollapce,
    advanceState,
    advancedSpanColAttrs
  }
}
