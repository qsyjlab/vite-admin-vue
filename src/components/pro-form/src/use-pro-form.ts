import { nextTick, ref, unref } from 'vue'
import { FormMethodsType } from './types/form'

interface UseProForm extends FormMethodsType {
  register: (instance: FormMethodsType | null) => void
  getForm: () => Promise<FormMethodsType>
}

export function useProForm(): UseProForm {
  const formRef = ref<FormMethodsType | null>(null)
  function register(instance: FormMethodsType | null) {
    formRef.value = instance
  }

  async function getForm() {
    const form = unref(formRef)

    if (!form) {
      throw Error('The form instance is not registered')
    }
    await nextTick()
    return form
  }

  const forceUpdateModel: FormMethodsType['forceUpdateModel'] = async model => {
    const instance = await getForm()
    instance.forceUpdateModel(model)
  }

  const resetFields: FormMethodsType['resetFields'] = async () => {
    const instance = await getForm()
    instance.resetFields()
  }

  const clearValidate: FormMethodsType['clearValidate'] = async () => {
    const instance = await getForm()
    instance.clearValidate()
  }

  const validate: FormMethodsType['validate'] = async handle => {
    const instance = await getForm()
    instance.validate(handle)
  }

  const validateField: FormMethodsType['validateField'] = async () => {
    const instance = await getForm()
    instance.validateField()
  }

  const scrollToField: FormMethodsType['scrollToField'] = async () => {
    const instance = await getForm()
    instance.scrollToField()
  }

  const updateSchemas: FormMethodsType['updateSchemas'] = async schemas => {
    const instance = await getForm()
    instance.updateSchemas(schemas)
  }

  const appendSchemaByField: FormMethodsType['appendSchemaByField'] = async (...rest) => {
    const instance = await getForm()
    instance.appendSchemaByField(...rest)
  }

  return {
    register,
    getForm,
    validate,
    scrollToField,
    resetFields,
    clearValidate,
    validateField,
    forceUpdateModel,
    updateSchemas,
    appendSchemaByField
  }
}
