import { nextTick, unref, type Ref } from 'vue'
import type {
  FormFieldProp,
  FormMethodsType,
  FormModel,
  FormValidationCallback
} from './types/form'

type ProFormRef<TModel extends FormModel> = Readonly<Ref<FormMethodsType<TModel> | null>>

/** Typed form commands backed by a Vue 3.5 template ref. */
export function useProForm<TModel extends FormModel = FormModel>(templateRef: ProFormRef<TModel>) {
  const formInstance = templateRef

  async function getForm() {
    await nextTick()
    const form = unref(formInstance)

    if (!form) throw Error('The form template ref is not available')
    return form
  }

  async function forceUpdateModel(model?: Partial<TModel>) {
    const instance = await getForm()
    instance.forceUpdateModel(model)
  }

  async function submit() {
    return (await getForm()).submit()
  }

  async function reset() {
    ;(await getForm()).reset()
  }

  async function resetFields() {
    const instance = await getForm()
    instance.resetFields()
  }

  async function clearValidate(props?: FormFieldProp | FormFieldProp[]) {
    const instance = await getForm()
    instance.clearValidate(props)
  }

  async function validate(handle?: (model: TModel) => void) {
    const instance = await getForm()
    return instance.validate(handle)
  }

  async function validateField(
    props?: FormFieldProp | FormFieldProp[],
    callback?: FormValidationCallback
  ) {
    const instance = await getForm()
    return instance.validateField(props, callback)
  }

  async function scrollToField(prop: FormFieldProp) {
    const instance = await getForm()
    instance.scrollToField(prop)
  }

  async function setFieldValue<TValue = unknown>(
    name: Parameters<FormMethodsType<TModel>['setFieldValue']>[0],
    value: TValue
  ) {
    const instance = await getForm()
    instance.setFieldValue(name, value)
  }

  async function getFieldValue<TValue = unknown>(
    name: Parameters<FormMethodsType<TModel>['getFieldValue']>[0]
  ) {
    const instance = await getForm()
    return instance.getFieldValue<TValue>(name)
  }

  async function getFieldsValue(
    options?: Parameters<FormMethodsType<TModel>['getFieldsValue']>[0]
  ) {
    const instance = await getForm()
    return instance.getFieldsValue(options)
  }

  async function setFieldErrors(errors: Parameters<FormMethodsType<TModel>['setFieldErrors']>[0]) {
    const instance = await getForm()
    instance.setFieldErrors(errors)
  }

  async function clearFieldErrors(
    names?: Parameters<FormMethodsType<TModel>['clearFieldErrors']>[0]
  ) {
    const instance = await getForm()
    instance.clearFieldErrors(names)
  }

  async function getCollapsed() {
    return (await getForm()).getCollapsed()
  }

  async function setCollapsed(collapsed: boolean) {
    ;(await getForm()).setCollapsed(collapsed)
  }

  async function toggleCollapse() {
    ;(await getForm()).toggleCollapse()
  }

  async function load() {
    return (await getForm()).load()
  }

  async function getLoading() {
    return (await getForm()).getLoading()
  }

  async function getRequestLifecycle() {
    return (await getForm()).getRequestLifecycle()
  }

  async function getError() {
    return (await getForm()).getError()
  }

  async function retryRequest() {
    return (await getForm()).retryRequest()
  }

  async function cancelRequest(reason?: unknown) {
    ;(await getForm()).cancelRequest(reason)
  }

  async function getSubmitting() {
    return (await getForm()).getSubmitting()
  }

  async function isDirty() {
    return (await getForm()).isDirty()
  }

  async function markClean() {
    ;(await getForm()).markClean()
  }

  return {
    formInstance,
    getForm,
    submit,
    reset,
    validate,
    scrollToField,
    resetFields,
    clearValidate,
    validateField,
    forceUpdateModel,
    setFieldValue,
    getFieldValue,
    getFieldsValue,
    setFieldErrors,
    clearFieldErrors,
    getCollapsed,
    setCollapsed,
    toggleCollapse,
    load,
    getLoading,
    getRequestLifecycle,
    getError,
    retryRequest,
    cancelRequest,
    getSubmitting,
    isDirty,
    markClean
  }
}
