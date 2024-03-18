import type { SetupContext } from 'vue'
import { reactive, ref, watch, computed, toRaw, markRaw } from 'vue'
import { FormProps, formEmits, emitsEnums } from './form-props'
import { ElFormInstance } from './types'
import { useCollapse } from './use-collapse'
import { FormMethodsType, FormSchema, NOOP } from './types/form'
import { isFunction, isObject, isPlainObject } from '@/utils'

type UseFormParameter = {
  props: FormProps
  emits: SetupContext<typeof formEmits>['emit']
}

export const useForm = (parameter: UseFormParameter) => {
  const { props, emits } = parameter
  const { inline } = props

  const formSchemaes = computed(() =>
    props.fields
      .filter(field => {
        const isShow = (field: FormSchema) => {
          const { show = true, key } = field

          if (isFunction(show)) {
            return show(formModel[key], { ...formModel })
          }

          return show
        }

        return isShow(field)
      })
      .map(item => {
        return {
          ...item,
          el: item.el && isPlainObject(item.el) ? markRaw(item.el) : item.el
        }
      })
  )

  const formRef = ref<ElFormInstance | null>(null)

  const formModel = reactive<Record<string, any>>({})

  const {
    fieldsIsCollapsedMap,
    toggleCollapse,
    advanceState,
    advancedSpanColAttrs,
    updateCollapce
  } = useCollapse({
    fields: formSchemaes,
    isWatch: inline,
    model: formModel
  })

  watch([formModel, formSchemaes], () => {
    updateCollapce()
  })

  // watch(
  //   () => props.fields,
  //   () => {
  //     initializeForm()
  //   },
  //   {
  //     immediate: true
  //   }
  // )

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

  const setFieldValue: FormMethodsType['setFieldValue'] = (key, value) => {
    formModel[key] = value
  }
  const getFieldValue: FormMethodsType['getFieldValue'] = key => {
    return formModel[key]
  }

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

  const setFormRef = (ref: any) => {
    formRef.value = ref

    emits(emitsEnums.REGISTER, formExposeMethods)
  }

  const formExposeMethods: FormMethodsType = {
    forceUpdateModel,
    resetFields,
    clearValidate,
    validate,
    setFieldValue,
    getFieldValue,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateField: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    scrollToField: () => {}
  }

  return {
    setFieldValue,
    getFieldValue,
    formSchemaes,
    formExposeMethods,
    advanceState: computed(() => advanceState),
    formModel,
    setFormRef,
    resetFields,
    validate,
    fieldsIsCollapsedMap,
    toggleCollapse,
    advancedSpanColAttrs
  }
}
