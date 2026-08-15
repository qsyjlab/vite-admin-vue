import { cloneDeep } from 'lodash-es'
import { getProPathValue, setProPathValue } from '../../shared/pro-path'
import { getFormDependencyKey } from './form-dependency'
import type { FormModel, FormSchema } from './types/form'

export function transformFormValues<TModel extends FormModel>(
  source: TModel,
  fields: FormSchema<TModel>[]
): TModel {
  const values = cloneDeep(source)

  fields.forEach(field => {
    if (!field.transform) return
    const name = field.name ?? String(field.key)
    const dependencyPaths = field.dependencies || []
    const dependencyValues = dependencyPaths.map(path => getProPathValue(values, path))
    const dependencies = dependencyPaths.reduce<Record<string, unknown>>((result, path, index) => {
      result[getFormDependencyKey(path)] = dependencyValues[index]
      return result
    }, {})
    const value = getProPathValue(values, name)
    setProPathValue(
      values,
      name,
      field.transform(value, {
        name,
        value,
        values,
        dependencies,
        dependencyValues,
        getFieldValue: path => getProPathValue(values, path)
      })
    )
  })

  return values
}
