import type { SetupContext } from 'vue'
import { ref, watch, computed, toRaw, markRaw } from 'vue'
import { FormProps, formEmits, emitsEnums } from './form-props'
import { ElFormInstance } from './types'
import { useCollapse } from './use-collapse'
import { FormMethodsType, FormSchema, NOOP } from './types/form'
import { isFunction, isPlainObject } from '@/utils'

type UseFormParameter = {
  props: FormProps
  emits: SetupContext<typeof formEmits>['emit']
}

export const useForm = (parameter: UseFormParameter) => {
  const { props, emits } = parameter
  const formRef = ref<ElFormInstance | null>(null)

  const formModel = ref<Record<string, any>>({})

  const formSchemaes = computed(() =>
    props.fields
      .filter(field => {
        const isShow = (field: FormSchema) => {
          const { show = true, key } = field

          if (isFunction(show)) {
            return show(formModel.value[key], { ...formModel.value })
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

  const isWatchCollapse = props.layout

  const {
    fieldsIsCollapsedMap,
    toggleCollapse,
    advanceState,
    advancedSpanColAttrs,
    updateCollapce
  } = useCollapse({
    fields: formSchemaes,
    isWatch: isWatchCollapse
  })

  if (isWatchCollapse) {
    watch([formModel, formSchemaes], () => {
      updateCollapce()
    })
  }

  // 判定是否启用 effect change
  if (props.enableEffect) {
    watch(formModel, (newVal, oldVal) => {
      emits('effect', toRaw(newVal), toRaw(oldVal))
    })
  }

  watch(
    () => props.model,
    () => {
      forceUpdateModel()
    },
    {
      immediate: true,
      deep: true
    }
  )

  const setFieldValue: FormMethodsType['setFieldValue'] = (key, value) => {
    formModel.value[key] = value
  }
  const getFieldValue: FormMethodsType['getFieldValue'] = key => {
    return formModel.value[key]
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

  function forceUpdateModel(model?: Record<string, any>) {
    formModel.value = Object.assign(props.model, formModel.value, model || {})
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
