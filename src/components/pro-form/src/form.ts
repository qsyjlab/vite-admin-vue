import type { SetupContext } from 'vue'
import { reactive, onBeforeMount, ref, watch, unref, computed } from 'vue'
import { FormProps, FormSchema, formEmits, emitsEnums } from './form-props'
import { ElFormInstance } from './types'
import { useCollapse } from './use-collapse'
import { FormMethodsType, NOOP } from './types/form'

type UseFormParameter = {
  props: FormProps
  emits: SetupContext<typeof formEmits>['emit']
}

export const useForm = (parameter: UseFormParameter) => {
  const { props, emits } = parameter
  const { fields = [], inline } = props

  const formRef = ref<ElFormInstance | null>(null)

  const formModel = reactive<Record<string, any>>({})

  const formRules = reactive<Record<string, FormSchema['rules']>>({})

  const { fieldsIsCollapsedMap, toggleCollapse, advanceState, advancedSpanColAttrs } = useCollapse({
    fields
  })

  onBeforeMount(() => {
    initializeForm()
  })

  watch(
    () => props.model,
    () => {
      forceUpdateModel()
    }
  )

  const validate = (handle?: () => void) => {
    formRef.value?.validate(valid => {
      if (!valid) return

      handle?.()
    })
  }

  const resetFields = (handle?: NOOP) => {
    formRef.value?.resetFields()
    handle?.()
  }

  const clearValidate: FormMethodsType['clearValidate'] = (...rest) => {
    formRef.value?.clearValidate(...rest)
  }

  const validateField = () => {}

  const initializeForm = () => {
    if (fields.length === 0) return
    fields.forEach(item => {
      formModel[item.key] = undefined

      if (!inline) {
        formRules[item.key] = item.rules
      }
    })
  }

  const forceUpdateModel = (model?: Record<string, any>) => {
    const _model = Object.assign(props.model, model || [])
    Object.keys(_model).forEach(key => {
      formModel[key] = _model[key]
    })
  }

  const handleElAttrs = (item: FormSchema) => {
    const { attrs } = item
    return {
      placeholder: item.label,
      ...attrs
    }
  }

  const handleSubmit = () => {
    validate(() => {})
  }

  const setFormRef = (ref: any) => {
    formRef.value = ref

    emits(emitsEnums.GET_INSTANCE, formRef.value)
  }

  const formExposeMethods: FormMethodsType = {
    forceUpdateModel,
    resetFields,
    clearValidate,
    validate,
    submit: handleSubmit,

    validateField: () => {},
    scrollToField: () => {}
  }

  return {
    formExposeMethods,
    advanceState: computed(() => advanceState),
    formModel,
    formRules,
    handleElAttrs,
    setFormRef,
    resetFields,
    validate,
    fieldsIsCollapsedMap,
    toggleCollapse,
    advancedSpanColAttrs
  }
}
