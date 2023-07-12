import type { SetupContext } from 'vue'
import { reactive, onBeforeMount, ref, watch } from 'vue'
import { FormProps, FormItem, formEmits, emitsEnums } from './form-props'
import { ElFormInstance } from './types'

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

  onBeforeMount(() => {
    initializeForm()
  })

  watch(
    () => props.model,
    () => {
      changeModelValue()
    }
  )

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

  return { formModel, formRules, handleElAttrs, setFormRef, validate, reset }
}
