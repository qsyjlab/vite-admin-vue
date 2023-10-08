import { computed, reactive, watch } from 'vue'
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

  const advanceState = reactive<{
    isAdvanced: boolean
    hideAdvanceBtn: boolean
    span: number
  }>({
    isAdvanced: true,
    hideAdvanceBtn: false,
    span: 8
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

  const advancedSpanColAttrs = computed<Partial<ColProps>>(() => {
    return {
      span: advanceState.span,
      offset: BASIC_COL_LEN - advanceState.span
    }
  })

  function toggleCollapse() {
    advanceState.isAdvanced = !advanceState.isAdvanced
  }

  function updateCollapce() {
    let totalSpan = 0

    let firstRowFull = false
    fields.forEach((item, index) => {
      const colSpan = item.col?.span || BASIC_COL_LEN

      if (index === 0 && colSpan === BASIC_COL_LEN) {
        firstRowFull = true
      }
      const hidden = !advanceState.isAdvanced && (firstRowFull || (!!index && totalSpan >= 24))

      fieldsIsCollapsedMap[item.key] = !hidden

      totalSpan += colSpan
    })
  }

  return {
    fieldsIsCollapsedMap,
    toggleCollapse,
    updateCollapce,
    advanceState,
    advancedSpanColAttrs
  }
}
