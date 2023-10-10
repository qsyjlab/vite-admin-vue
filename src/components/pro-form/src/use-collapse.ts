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

  /**
   * TODO: 期望值action col 能与最后一行平级 在有空余的情况下
   *  show 控制函数加入
   */
  const advancedSpanColAttrs = computed<Partial<ColProps>>(() => {
    return {
      span: !advanceState.isAdvanced
        ? 24
        : advanceState.span > lastRowSpaceSpan.value
        ? BASIC_COL_LEN
        : advanceState.span,
      offset: !advanceState.isAdvanced
        ? 0
        : BASIC_COL_LEN - advanceState.span - lastRowSpaceSpan.value
    }
  })

  function toggleCollapse() {
    advanceState.isAdvanced = !advanceState.isAdvanced
  }

  function updateCollapce() {
    lastRowSpaceSpan.value = 0
    let totalSpan = 0

    let firstRowFull = false
    fields.forEach((item, index) => {
      const colSpan = item.col?.span || BASIC_COL_LEN
      lastRowSpaceSpan.value += colSpan

      const curRowSpaceSpan = BASIC_COL_LEN - lastRowSpaceSpan.value

      if (curRowSpaceSpan <= 0) {
        lastRowSpaceSpan.value = 0
        lastRowSpaceSpan.value += colSpan
      }

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
