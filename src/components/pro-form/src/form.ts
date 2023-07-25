import { SetupContext, toRaw } from 'vue'
import { reactive, onBeforeMount, ref, watch, computed } from 'vue'
import { FormProps, FormSchema, formEmits, emitsEnums } from './form-props'
import { ElFormInstance } from './types'
import { useCollapse } from './use-collapse'
import { useSchema } from './use-schema'
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
  const { formSchemaes, updateSchemas, appendSchemaByField } = useSchema(fields)

  const { fieldsIsCollapsedMap, toggleCollapse, advanceState, advancedSpanColAttrs } = useCollapse({
    fields: formSchemaes.value,
    isWatch: inline
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

  const validate: FormMethodsType['validate'] = handle => {
    formRef.value?.validate(valid => {
      if (!valid) return

      handle?.(toRaw(formModel))
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

    emits(emitsEnums.REGISTER, formExposeMethods)
  }

  const formExposeMethods: FormMethodsType = {
    forceUpdateModel,
    resetFields,
    clearValidate,
    validate,
    updateSchemas,
    appendSchemaByField,
    validateField: () => {},
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
