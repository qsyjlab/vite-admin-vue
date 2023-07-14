import { useBreakpoint } from '@/hooks/event/use-breakpoint'
import { reactive, unref, watch } from 'vue'
import { FormSchema } from './types/form'

interface CollapseOption {
  fields: FormSchema[]
}

export function useCollapse(option: CollapseOption) {
  const { fields } = option

  const { widthRef, screenEnum } = useBreakpoint()

  const fieldsIsCollapsedMap = reactive<Record<string, boolean>>({})

  const BASIC_COL_LEN = 24

  const realItemColSum = 0

  const advanceState = reactive<{
    isAdvanced: boolean
    hideAdvanceBtn: boolean
  }>({
    isAdvanced: true,
    hideAdvanceBtn: false
  })

  watch(
    [() => fields, () => widthRef, () => advanceState.isAdvanced],
    () => {
      updateCollapce()

      console.log('执行')
    },
    {
      immediate: true
    }
  )

  function toggleCollapse() {
    advanceState.isAdvanced = !advanceState.isAdvanced
  }

  function updateCollapce() {
    let _itemColSum = 0

    fields.forEach(item => {
      const { isAdvanced, itemColSum } = getCollapsed(item.col, _itemColSum)
      _itemColSum = itemColSum
      // if (isAdvanced) {
      //   realItemColSum = itemColSum
      // }
      fieldsIsCollapsedMap[item.key] = isAdvanced
    })
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
    } else if (width < screenEnum.XL) {
      itemColSum += lgWidth
    } else if (width < screenEnum.XXL) {
      itemColSum += xlWidth
    } else {
      itemColSum += xxlWidth
    }

    // if (isLastAction) {
    //   advanceState.hideAdvanceBtn = false
    //   if (itemColSum <= BASIC_COL_LEN * 2) {
    //     // When less than or equal to 2 lines, the collapse and expand buttons are not displayed
    //     advanceState.hideAdvanceBtn = true
    //     advanceState.isAdvanced = true
    //   } else if (itemColSum > BASIC_COL_LEN * 2 && itemColSum <= BASIC_COL_LEN * 3) {
    //     advanceState.hideAdvanceBtn = false

    //     // More than 3 lines collapsed by default
    //   } else if (!advanceState.isLoad) {
    //     advanceState.isLoad = true
    //     advanceState.isAdvanced = !advanceState.isAdvanced
    //   }
    //   return { isAdvanced: advanceState.isAdvanced, itemColSum }
    // }

    const alwaysShowLines = 1
    if (itemColSum > BASIC_COL_LEN * (alwaysShowLines || 1)) {
      return { isAdvanced: advanceState.isAdvanced, itemColSum }
    }
    // The first line is always displayed
    return { isAdvanced: true, itemColSum }
  }

  return { fieldsIsCollapsedMap, toggleCollapse, updateCollapce, advanceState }
}
