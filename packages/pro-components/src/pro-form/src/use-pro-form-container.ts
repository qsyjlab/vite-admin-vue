import { computed, nextTick, ref, type Ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { FormMethodsType, FormModel } from './types/form'
import type { ProFormContainerBehavior, ProFormContainerOpenOptions } from './pro-form-container'
import { useProForm } from './use-pro-form'

interface UseProFormContainerOptions<TModel extends FormModel, TResult> {
  visible: Ref<boolean>
  formRef: Readonly<Ref<FormMethodsType<TModel> | null>>
  getBehavior: () => ProFormContainerBehavior<TModel, TResult>
  onOpen?: (options: ProFormContainerOpenOptions<TModel>) => void
  onSuccess?: (result: TResult | undefined, values: TModel) => void
  onError?: (error: unknown) => void
  onClose?: () => void
}

export function useProFormContainer<TModel extends FormModel, TResult = unknown>(
  options: UseProFormContainerOptions<TModel, TResult>
) {
  const loadingData = ref(false)
  const submitting = ref(false)
  const loading = computed(() => loadingData.value || submitting.value)
  const result = ref<TResult>()
  const form = useProForm(options.formRef)
  let loadSequence = 0

  async function reset() {
    await nextTick()
    if (!options.formRef.value) return
    await form.resetFields()
    await form.clearValidate()
    await form.clearFieldErrors()
  }

  async function open(openOptions: ProFormContainerOpenOptions<TModel> = {}) {
    const behavior = options.getBehavior()
    const sequence = ++loadSequence
    result.value = undefined
    options.visible.value = true
    options.onOpen?.(openOptions)
    await nextTick()
    await reset()
    await form.forceUpdateModel({
      ...cloneDeep(behavior.initialValues || ({} as TModel)),
      ...cloneDeep(openOptions.values || {})
    } as Partial<TModel>)
    await form.markClean()

    if (openOptions.id !== undefined && behavior.load) {
      loadingData.value = true
      try {
        const values = await behavior.load(openOptions.id)
        if (sequence === loadSequence) {
          await form.forceUpdateModel(values)
          await form.markClean()
        }
      } catch (error) {
        if (sequence === loadSequence) options.onError?.(error)
      } finally {
        if (sequence === loadSequence) loadingData.value = false
      }
    }
  }

  async function close() {
    return closeInternal(false)
  }

  async function closeInternal(force: boolean) {
    if (!force && submitting.value && options.getBehavior().preventCloseWhileSubmitting !== false) {
      return false
    }
    if (!force && !(await canCloseDirtyForm())) return false
    loadSequence += 1
    loadingData.value = false
    options.visible.value = false
    if (options.getBehavior().resetOnClose !== false) await reset()
    options.onClose?.()
    return true
  }

  async function submit() {
    if (loading.value) return false
    const behavior = options.getBehavior()
    if (behavior.beforeSubmit && !(await behavior.beforeSubmit(await form.getForm()))) return false
    const valid = await form.validate()
    if (!valid) return false

    const values = await form.getFieldsValue()
    submitting.value = true
    try {
      const submitResult = behavior.onFinish ? await behavior.onFinish(values) : undefined
      if (submitResult === false) return false
      result.value = submitResult as TResult | undefined
      options.onSuccess?.(result.value, values)
      if (behavior.closeOnSuccess !== false) await closeInternal(true)
      return true
    } catch (error) {
      const fieldErrors = behavior.mapError?.(error)
      if (fieldErrors?.length) await form.setFieldErrors(fieldErrors)
      options.onError?.(error)
      return false
    } finally {
      submitting.value = false
    }
  }

  async function canCloseDirtyForm() {
    const behavior = options.getBehavior()
    if (behavior.warnWhenDirty === false || !options.formRef.value || !(await form.isDirty())) {
      return true
    }
    const message = behavior.dirtyConfirmMessage ?? '表单存在未保存的修改，确认关闭吗？'
    if (behavior.confirmDirtyClose) return behavior.confirmDirtyClose(message)
    return typeof window === 'undefined' ? false : window.confirm(message)
  }

  return {
    form,
    loading,
    loadingData: computed(() => loadingData.value),
    submitting: computed(() => submitting.value),
    result: computed(() => result.value),
    open,
    close,
    submit,
    reset
  }
}
