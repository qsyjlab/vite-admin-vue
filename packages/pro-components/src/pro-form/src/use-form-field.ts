import {
  computed,
  onScopeDispose,
  ref,
  toRaw,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type WatchStopHandle
} from 'vue'
import { cloneDeep } from 'lodash-es'
import { useFormContext } from './provider'
import type {
  FormDynamicValue,
  FormFieldDependencyContext,
  FormModel,
  FormSchema
} from './types/form'
import { getFormDependencyKey, resolveFormDynamicValue } from './form-dependency'

export function useFormField<TModel extends FormModel>(
  schemaSource: MaybeRefOrGetter<FormSchema<TModel>>
) {
  const formContext = useFormContext<TModel>()
  const modelSnapshot = ref<TModel>(cloneDeep(toRaw(formContext.formModel.value)))

  const schema = computed(() => toValue(schemaSource))
  const fieldName = computed(() => schema.value.name ?? String(schema.value.key))
  const dependencyPaths = computed(() => schema.value.dependencies || [])
  const dependencyValues = computed(() =>
    dependencyPaths.value.map(path => formContext.getFieldValue(path))
  )
  const dependencies = computed(() =>
    dependencyPaths.value.reduce<Record<string, unknown>>((result, path, index) => {
      result[getFormDependencyKey(path)] = dependencyValues.value[index]
      return result
    }, {})
  )

  let stopModelWatch: WatchStopHandle | undefined
  const stopShouldUpdateWatch = watch(
    () => schema.value.shouldUpdate,
    shouldUpdate => {
      stopModelWatch?.()
      stopModelWatch = undefined
      if (!shouldUpdate) return

      modelSnapshot.value = cloneDeep(toRaw(formContext.formModel.value))
      stopModelWatch = watch(
        () => cloneDeep(formContext.formModel.value),
        (current, previous) => {
          if (shouldUpdate(previous, current)) modelSnapshot.value = current
        },
        { deep: true }
      )
    },
    { immediate: true }
  )

  onScopeDispose(() => {
    stopShouldUpdateWatch()
    stopModelWatch?.()
  })

  const context = computed<FormFieldDependencyContext<TModel>>(() => ({
    name: fieldName.value,
    value: formContext.getFieldValue(fieldName.value),
    values: schema.value.shouldUpdate ? modelSnapshot.value : formContext.formModel.value,
    dependencies: dependencies.value,
    dependencyValues: dependencyValues.value,
    getFieldValue: formContext.getFieldValue
  }))

  function resolve<TValue>(
    value: FormDynamicValue<TModel, TValue> | undefined,
    fallback: TValue
  ): TValue {
    const preferContext = Boolean(schema.value.dependencies?.length || schema.value.shouldUpdate)
    return resolveFormDynamicValue(value, context.value, preferContext, fallback)
  }

  return {
    context,
    dependencies,
    dependencyValues,
    fieldName,
    resolve
  }
}
