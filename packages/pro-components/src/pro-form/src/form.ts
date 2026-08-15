import {
  computed,
  getCurrentInstance,
  markRaw,
  nextTick,
  onBeforeUnmount,
  reactive,
  ref,
  toRaw,
  watch,
  type Ref
} from 'vue'
import { cloneDeep, isEqual, isPlainObject } from 'lodash-es'
import { getProPathValue, setProPathValue } from '../../shared/pro-path'
import { isProRequestAbort, useProRequest } from '../../shared/pro-request'
import { getFormDependencyKey } from './form-dependency'
import { normalizeFormFieldErrors } from './form-errors'
import { transformFormValues } from './form-values'
import { emitsEnums, type FormEmit, type NormalizedFormProps } from './form-props'
import type { ElFormInstance } from './types'
import type {
  FormFieldProp,
  FormMethodsType,
  FormModel,
  FormSchema,
  FormValidationCallback
} from './types/form'
import { useCollapse } from './use-collapse'

type UseFormParameter<TModel extends FormModel> = {
  props: NormalizedFormProps<TModel>
  emits: FormEmit<TModel>
}

export const useForm = <TModel extends FormModel>(parameter: UseFormParameter<TModel>) => {
  const { props, emits } = parameter
  const formRef = ref<ElFormInstance | null>(null)
  const formModel = ref(cloneDeep(props.model)) as Ref<TModel>
  const cleanSnapshot = ref(cloneDeep(toRaw(formModel.value))) as Ref<TModel>
  const submitting = ref(false)
  const requestState = useProRequest<Partial<TModel>>()
  const loading = computed(() => requestState.loading.value || submitting.value)
  const requestLifecycle = computed(() => ({
    phase: requestState.phase.value,
    action: requestState.action.value,
    loading: requestState.loading.value,
    initialLoading: requestState.initialLoading.value,
    refreshing: requestState.refreshing.value
  }))
  const dirty = computed(() => !isEqual(formModel.value, cleanSnapshot.value))
  const internalCollapsed = ref(props.defaultCollapsed)
  let effectSnapshot = cloneDeep(toRaw(formModel.value))
  const fieldVisibilityMap = reactive<Record<string, boolean>>({})
  const fieldErrorMap = reactive<Record<string, string>>({})
  const collapsedPreference = computed({
    get: () => props.collapsed ?? internalCollapsed.value,
    set: value => {
      if (props.collapsed === undefined) internalCollapsed.value = value
      emits(emitsEnums.UPDATE_COLLAPSED, value)
      emits(emitsEnums.COLLAPSE, value)
    }
  })
  const hasSubmitter = computed(
    () => props.submitter !== false && (props.submitter !== undefined || props.inline)
  )
  const submitterConfig = computed(() =>
    typeof props.submitter === 'object' ? props.submitter : {}
  )

  const getFieldName = (field: FormSchema<TModel>) => field.name ?? String(field.key)
  const getFieldKey = (name: Parameters<FormMethodsType<TModel>['getFieldValue']>[0]) =>
    getFormDependencyKey(name)

  const getFieldValue: FormMethodsType<TModel>['getFieldValue'] = name =>
    getProPathValue(formModel.value, name)

  const setFieldValue: FormMethodsType<TModel>['setFieldValue'] = (name, value) => {
    const previousValue = getFieldValue(name)
    const schema = props.fields.find(
      field => getFieldKey(getFieldName(field)) === getFieldKey(name)
    )
    const nextValue = schema?.normalize
      ? schema.normalize(value, previousValue, formModel.value)
      : value
    setProPathValue(formModel.value, name, nextValue)
    delete fieldErrorMap[getFieldKey(name)]
  }

  const getFieldsValue: FormMethodsType<TModel>['getFieldsValue'] = (options): TModel => {
    const values = cloneDeep(toRaw(formModel.value)) as TModel
    return options?.transform === false
      ? values
      : transformFormValues<TModel>(values, props.fields as FormSchema<TModel>[])
  }

  const formSchemaes = computed(() =>
    props.fields.map(item => ({
      ...item,
      el:
        item.el && typeof item.el === 'object' && isPlainObject(item.el)
          ? markRaw(item.el)
          : item.el
    }))
  )

  const {
    canCollapse,
    collapsed,
    fieldsIsCollapsedMap,
    setCollapsed,
    submitterColAttrs,
    toggleCollapse
  } = useCollapse({
    fields: formSchemaes,
    collapsed: collapsedPreference,
    collapsedRows: () => props.collapsedRows,
    collapsible: () => props.layout && props.collapsible,
    hasSubmitter,
    submitterCol: () => submitterConfig.value.col,
    fieldVisibilityMap
  })

  if (props.enableEffect) {
    watch(
      formModel,
      newValue => {
        const nextValue = cloneDeep(toRaw(newValue))
        emits('effect', nextValue, effectSnapshot)
        effectSnapshot = cloneDeep(nextValue)
      },
      { deep: true }
    )
  }

  watch(
    () => props.model,
    model => {
      formModel.value = cloneDeep(model) as TModel
      markClean()
    },
    { immediate: true, deep: true }
  )

  watch(loading, value => emits(emitsEnums.UPDATE_LOADING, value), { immediate: true })
  watch(requestLifecycle, lifecycle => emits(emitsEnums.REQUEST_STATE_CHANGE, { ...lifecycle }), {
    immediate: true
  })
  watch(dirty, value => emits(emitsEnums.UPDATE_DIRTY, value), { immediate: true })
  watch(
    [() => props.request, () => props.autoRequest],
    ([request, autoRequest]) => {
      if (request && autoRequest) void load().catch(handleLoadError)
    },
    { immediate: true }
  )
  if (getCurrentInstance()) onBeforeUnmount(requestState.cancel)

  const validate: FormMethodsType<TModel>['validate'] = async handle => {
    if (!formRef.value) return false

    try {
      const valid = await formRef.value.validate()
      if (valid) handle?.(getFieldsValue())
      return valid
    } catch (invalidFields) {
      if (props.expandOnInvalid && collapsed.value) {
        setCollapsed(false)
        await nextTick()
      }
      const firstField = getFirstInvalidField(invalidFields)
      if (firstField) {
        formRef.value.scrollToField(firstField)
        await focusField(firstField)
      }
      return false
    }
  }

  const resetFields: FormMethodsType<TModel>['resetFields'] = () => {
    formRef.value?.resetFields()
    formRef.value?.clearValidate()
    clearFieldErrors()
  }

  const clearValidate: FormMethodsType<TModel>['clearValidate'] = propsToClear => {
    formRef.value?.clearValidate(propsToClear)
    clearFieldErrors(propsToClear)
  }

  const setFieldErrors: FormMethodsType<TModel>['setFieldErrors'] = errors => {
    normalizeFormFieldErrors(errors).forEach(error => {
      fieldErrorMap[getFieldKey(error.name)] = Array.isArray(error.errors)
        ? error.errors.join('，')
        : error.errors
    })
  }

  const clearFieldErrors: FormMethodsType<TModel>['clearFieldErrors'] = names => {
    if (names === undefined) {
      Object.keys(fieldErrorMap).forEach(key => delete fieldErrorMap[key])
      return
    }

    const normalizedNames = Array.isArray(names)
      ? Array.isArray(names[0])
        ? (names as FormFieldProp[])
        : [names as FormFieldProp]
      : [names]
    normalizedNames.forEach(name => delete fieldErrorMap[getFormDependencyKey(name)])
  }

  const getFieldError = (name: string | number | readonly (string | number)[]) =>
    fieldErrorMap[getFormDependencyKey(name)] || ''

  const validateField: FormMethodsType<TModel>['validateField'] = (
    fieldProps?: FormFieldProp | FormFieldProp[],
    callback?: FormValidationCallback
  ) => {
    if (!formRef.value) return Promise.resolve(false)

    return new Promise(resolve => {
      formRef.value?.validateField(fieldProps, (valid, invalidFields) => {
        callback?.(valid, invalidFields)
        resolve(valid)
      })
    })
  }

  const scrollToField: FormMethodsType<TModel>['scrollToField'] = fieldProp => {
    formRef.value?.scrollToField(fieldProp)
  }

  const forceUpdateModel: FormMethodsType<TModel>['forceUpdateModel'] = model => {
    formModel.value = model
      ? ({ ...getFieldsValue({ transform: false }), ...cloneDeep(model) } as TModel)
      : (cloneDeep(props.model) as TModel)
  }

  const submit: FormMethodsType<TModel>['submit'] = async () => {
    if (submitting.value) return false
    submitting.value = true
    try {
      const valid = await validate()
      if (!valid) return false
      const values = cloneDeep(getFieldsValue())
      if ((await props.onFinish?.(values)) === false) return false
      emits(emitsEnums.SUBMIT, values)
      emits(emitsEnums.SUBMIT_SUCCESS, values)
      markClean()
      return true
    } catch (error) {
      emits(emitsEnums.SUBMIT_ERROR, error)
      return false
    } finally {
      submitting.value = false
    }
  }

  const reset: FormMethodsType<TModel>['reset'] = () => {
    resetFields()
    emits(emitsEnums.RESET, cloneDeep(getFieldsValue()))
  }

  async function executeLoad(action?: 'initial' | 'refresh' | 'retry') {
    if (!props.request) {
      formModel.value = cloneDeep(props.model) as TModel
      markClean()
      return getFieldsValue({ transform: false })
    }
    const values = await requestState.execute((_, context) => props.request!(context), undefined, {
      action: action ?? (requestState.data.value === undefined ? 'initial' : 'refresh'),
      debounce: props.requestDebounce,
      retry: props.requestRetry,
      retryDelay: props.requestRetryDelay
    })
    formModel.value = {
      ...cloneDeep(props.model),
      ...cloneDeep(values)
    } as TModel
    clearFieldErrors()
    await nextTick()
    markClean()
    return getFieldsValue({ transform: false })
  }

  function load() {
    return executeLoad()
  }

  function retryRequest() {
    return executeLoad('retry')
  }

  function markClean() {
    cleanSnapshot.value = cloneDeep(toRaw(formModel.value)) as TModel
  }

  function handleLoadError(error: unknown) {
    if (!isProRequestAbort(error)) emits(emitsEnums.REQUEST_ERROR, error)
  }

  const formExposeMethods: FormMethodsType<TModel> = {
    submit,
    reset,
    forceUpdateModel,
    resetFields,
    clearValidate,
    validate,
    validateField,
    scrollToField,
    setFieldValue,
    getFieldValue,
    getFieldsValue,
    setFieldErrors,
    clearFieldErrors,
    getCollapsed: () => collapsed.value,
    setCollapsed,
    toggleCollapse,
    load,
    getRequestLifecycle: () => ({ ...requestLifecycle.value }),
    getError: () => requestState.error.value,
    retryRequest,
    cancelRequest: requestState.cancel,
    getLoading: () => loading.value,
    getSubmitting: () => submitting.value,
    isDirty: () => dirty.value,
    markClean
  }

  const setFormRef = (instance: ElFormInstance | null) => {
    formRef.value = instance
  }

  return {
    formSchemaes,
    formExposeMethods,
    canCollapse,
    collapsed,
    formModel,
    hasSubmitter,
    submitterConfig,
    submit,
    reset,
    setFormRef,
    resetFields,
    validate,
    fieldsIsCollapsedMap,
    toggleCollapse,
    submitterColAttrs,
    setCollapsed,
    getFieldValue,
    setFieldValue,
    getFieldsValue,
    fieldVisibilityMap,
    getFieldError,
    loading,
    submitting,
    dirty,
    load,
    requestLifecycle,
    markClean
  }
}

function getFirstInvalidField(invalidFields: unknown) {
  if (!invalidFields || typeof invalidFields !== 'object') return undefined
  return Object.keys(invalidFields)[0]
}

async function focusField(field: string) {
  await nextTick()
  if (typeof document === 'undefined') return
  const escapedField = typeof CSS === 'undefined' ? field : CSS.escape(field)
  const element = document.querySelector<HTMLElement>(
    `[name="${escapedField}"], [data-pro-field="${escapedField}"]`
  )
  const focusable = element?.matches('input, textarea, select, button, [tabindex]')
    ? element
    : element?.querySelector<HTMLElement>('input, textarea, select, button, [tabindex]')
  focusable?.focus()
}
