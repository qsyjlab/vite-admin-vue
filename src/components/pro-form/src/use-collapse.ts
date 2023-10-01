import { useBreakpoint } from '@/hooks/event/use-breakpoint'
import { computed, reactive, unref, watch } from 'vue'
import { FormSchema } from './types/form'

interface CollapseOption {
  isWatch: boolean
  fields: FormSchema[]
  alwaysShowLines?: number
  autoAdvancedLine?: number
}

export function useCollapse(option: CollapseOption) {
  const { fields, alwaysShowLines = 1, autoAdvancedLine = 3, isWatch } = option

  const { widthRef, screenEnum } = useBreakpoint()

  const fieldsIsCollapsedMap = reactive<Record<string, boolean>>({})

  const BASIC_COL_LEN = 24

  let realItemColSum = 0

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
      [() => fields, () => widthRef, () => advanceState.isAdvanced],
      () => {
        updateCollapce()
      },
      {
        immediate: true,
        deep: true
      }
    )
  }

  const advancedSpanColAttrs = computed(() => {
    const actionSpan = 24 - advanceState.span

    const showAdvancedButton = !advanceState.hideAdvanceBtn
    const advancedSpanObj = !advanceState.hideAdvanceBtn
      ? { span: actionSpan < 6 ? 24 : actionSpan }
      : {}
    const actionColOpt = {
      // style: { textAlign: 'right' },
      span: showAdvancedButton ? 6 : 4,
      ...advancedSpanObj
    }
    return actionColOpt
  })

  function toggleCollapse() {
    advanceState.isAdvanced = !advanceState.isAdvanced
  }

  function updateCollapce() {
    let _itemColSum = 0
    fields.forEach(item => {
      const { isAdvanced, itemColSum } = getCollapsed(item.col, _itemColSum)
      _itemColSum = itemColSum
      if (isAdvanced) {
        realItemColSum = itemColSum
      }
      fieldsIsCollapsedMap[item.key] = isAdvanced
    })

    advanceState.span = realItemColSum % BASIC_COL_LEN
    getCollapsed({ span: BASIC_COL_LEN }, _itemColSum, true)
  }

  function getCollapsed(itemCol: any, itemColSum = 0, isLastAction = false) {
    const width = unref(widthRef)

    const mdWidth =
      parseInt(itemCol.md as string) ||
      parseInt(itemCol.xs as string) ||
      parseInt(itemCol.sm as string) ||
      (itemCol.span as number) ||
      BASIC_COL_LEN

    const lgWidth = parseInt(itemCol.lg as string) || mdWidth
    const xlWidth = parseInt(itemCol.xl as string) || lgWidth
    const xxlWidth = parseInt(itemCol.xxl as string) || xlWidth

    if (width <= screenEnum.LG) {
      itemColSum += mdWidth
    } else if (width < screenEnum.SM) {
      itemColSum += lgWidth
    } else if (width < screenEnum.MD) {
      itemColSum += xlWidth
    } else {
      itemColSum += xxlWidth
    }

    if (isLastAction) {
      advanceState.hideAdvanceBtn = false
      if (itemColSum <= BASIC_COL_LEN * 2) {
        // When less than or equal to 2 lines, the collapse and expand buttons are not displayed
        advanceState.hideAdvanceBtn = true
        advanceState.isAdvanced = true
      } else if (itemColSum > BASIC_COL_LEN * 2 && itemColSum <= BASIC_COL_LEN * autoAdvancedLine) {
        advanceState.hideAdvanceBtn = false

        // More than 3 lines collapsed by default
      }
      return { isAdvanced: advanceState.isAdvanced, itemColSum }
    }

    if (itemColSum > BASIC_COL_LEN * (alwaysShowLines || 1)) {
      return { isAdvanced: advanceState.isAdvanced, itemColSum }
    }

    return { isAdvanced: true, itemColSum }
  }

  return {
    fieldsIsCollapsedMap,
    toggleCollapse,
    updateCollapce,
    advanceState,
    advancedSpanColAttrs
  }
}
