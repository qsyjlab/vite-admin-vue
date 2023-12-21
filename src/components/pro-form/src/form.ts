import { SetupContext, toRaw } from 'vue'
import { reactive, ref, watch, computed } from 'vue'
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
  const { inline } = props

  const formSchemaes = computed(() => props.fields)

  const formRef = ref<ElFormInstance | null>(null)

  const formModel = reactive<Record<string, any>>({})

  const formRules = reactive<Record<string, FormSchema['rules']>>({})

  const { fieldsIsCollapsedMap, toggleCollapse, advanceState, advancedSpanColAttrs } = useCollapse({
    fields: formSchemaes.value,
    isWatch: inline
  })

  watch(
    () => props.fields,
    () => {
      initializeForm()
    },
    {
      immediate: true
    }
  )

  // 判定是否启用 effect change
  if (props.enableEffect) {
    watch(formModel, () => {
      emits('effect', toRaw(formModel))
    })
  }

  watch(
    () => props.model,
    () => {
      forceUpdateModel()
    }
  )

  const validate: FormMethodsType['validate'] = handle => {
    formRef.value?.validate(valid => {
      if (!valid) return

      handle?.(toRaw(formModel))
    })
  }

  const resetFields = (handle?: NOOP) => {
    formRef.value?.resetFields()
    clearValidate()
    handle?.()
  }

  const clearValidate: FormMethodsType['clearValidate'] = (...rest) => {
    formRef.value?.clearValidate(...rest)
  }

  function initializeForm() {
    if (formSchemaes.value.length === 0) return
    formSchemaes.value.forEach(item => {
      formModel[item.key] = props.model[item.key]
    })
  }

  function forceUpdateModel(model?: Record<string, any>) {
    const _model = Object.assign(props.model, model || {})
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

  const setFormRef = (ref: any) => {
    formRef.value = ref

    emits(emitsEnums.REGISTER, formExposeMethods)
  }

  const formExposeMethods: FormMethodsType = {
    forceUpdateModel,
    resetFields,
    clearValidate,
    validate,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateField: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    scrollToField: () => {}
  }

  return {
    formSchemaes,
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
