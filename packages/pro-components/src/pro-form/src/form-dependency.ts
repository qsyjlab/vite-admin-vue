import { normalizeProPath, type ProPath } from '../../shared/pro-path'
import type {
  FormContextResolver,
  FormDynamicValue,
  FormFieldDependencyContext,
  FormLegacyResolver,
  FormModel
} from './types/form'

export function getFormDependencyKey(path: ProPath): string {
  return normalizeProPath(path).join('.')
}

export function resolveFormDynamicValue<TModel extends FormModel, TValue>(
  dynamicValue: FormDynamicValue<TModel, TValue> | undefined,
  context: FormFieldDependencyContext<TModel>,
  preferContext: boolean,
  fallback: TValue
): TValue {
  if (dynamicValue === undefined) return fallback
  if (typeof dynamicValue !== 'function') return dynamicValue

  if (preferContext) {
    return (dynamicValue as FormContextResolver<TModel, TValue>)(context)
  }

  return (dynamicValue as FormLegacyResolver<TModel, TValue>)(
    context.value,
    context.values as TModel
  )
}
