import type { SetupContext } from 'vue'
import { reactive, onBeforeMount, ref, watch, unref } from 'vue'
import { FormProps, FormItem, formEmits, emitsEnums } from './form-props'
import { ElFormInstance } from './types'
import { useBreakpoint } from '@/hooks/event/use-breakpoint'

type UseFormParameter = {
  props: FormProps
  emits: SetupContext<typeof formEmits>['emit']
}

export const useForm = (parameter: UseFormParameter) => {
  const { props, emits } = parameter
  const { fields = [], inline } = props

  const formRef = ref<ElFormInstance | null>(null)

  const formModel = reactive<Record<string, any>>({})

  const formRules = reactive<Record<string, FormItem['rules']>>({})

  const { widthRef, screenEnum } = useBreakpoint()

  const fieldsIsAdvancedMap = reactive<any>({})

  const advanceState = reactive<{
    isAdvanced: boolean
    hideAdvanceBtn: boolean
  }>({
    isAdvanced: true,
    hideAdvanceBtn: false
    // isLoad: false,
    // actionSpan: 6
  })

  const BASIC_COL_LEN = 24

  onBeforeMount(() => {
    initializeForm()
  })

  watch(
    () => props.model,
    () => {
      changeModelValue()
    }
  )
  let realItemColSum = 0

  watch(
    [() => props.fields, () => widthRef, () => advanceState.isAdvanced],
    () => {
      let _itemColSum = 0

      fields.forEach(item => {
        const { isAdvanced, itemColSum } = getAdvanced(item.col, _itemColSum)
        _itemColSum = itemColSum

        if (isAdvanced) {
          realItemColSum = itemColSum
        }
        fieldsIsAdvancedMap[item.key] = isAdvanced
      })
    },
    {
      immediate: true
    }
  )

  function toggleCollapse() {
    advanceState.isAdvanced = !advanceState.isAdvanced
  }

  function getAdvanced(itemCol: any, itemColSum = 0, isLastAction = false) {
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

    console.log('   _itemColSum = itemColSum', itemColSum)

    // The first line is always displayed
    return { isAdvanced: true, itemColSum }
  }

  const validate = (handle?: () => void) => {
    formRef.value?.validate(valid => {
      if (!valid) return

      handle?.()
    })
  }

  const reset = (handle?: () => void) => {
    formRef.value?.resetFields()

    formRef.value?.resetFields()

    handle?.()
  }

  const initializeForm = () => {
    if (fields.length === 0) return
    fields.forEach(item => {
      formModel[item.key] = undefined

      if (!inline) {
        formRules[item.key] = item.rules
      }
    })
  }

  const changeModelValue = () => {
    Object.keys(props.model).forEach(key => {
      formModel[key] = props.model[key]
    })
  }

  const handleElAttrs = (item: FormItem) => {
    const { attrs } = item
    return {
      placeholder: item.label,
      ...attrs
    }
  }

  const setFormRef = (ref: any) => {
    formRef.value = ref

    emits(emitsEnums.GET_INSTANCE, formRef.value)
  }

  return {
    fieldsIsAdvancedMap,
    formModel,
    formRules,
    handleElAttrs,
    setFormRef,
    validate,
    toggleCollapse,
    reset
  }
}
