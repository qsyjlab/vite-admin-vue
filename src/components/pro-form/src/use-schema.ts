import type { FormSchema } from './types'

import { cloneDeep } from 'lodash-es'
import { ref, unref } from 'vue'
import { deepMerge, isArray } from '@/utils'

export function useSchema(schemas: FormSchema[]) {
  const schemaRef = ref(cloneDeep(unref(schemas)))

  const schemaToArray = (schemas: FormSchema | FormSchema[]) => {
    return isArray(schemas) ? schemas : [schemas]
  }

  const updateSchemas = (schemas: FormSchema | FormSchema[]) => {
    const _schemas = schemaToArray(schemas)

    _schemas.forEach(schema => {
      const atIndex = schemaRef.value.findIndex(i => i.key === schema.key)

      if (atIndex !== -1) {
        const newVal = deepMerge(schemaRef.value[atIndex], schema)
        schemaRef.value[atIndex] = newVal
      }
    })
  }

  /**
   * position default after
   * @returns
   */
  const appendSchemaByField = (
    schemas: FormSchema | FormSchema[],
    referKey: string,
    position?: 'after' | 'before'
  ) => {
    const _schemas = schemaToArray(schemas)

    const atIndex = schemaRef.value.findIndex(i => i.key === referKey)
    if (atIndex === -1) return

    if (position === 'before') {
      schemaRef.value.splice(atIndex === 0 ? 0 : atIndex - 1, 0, ..._schemas)
    } else {
      schemaRef.value.splice(
        atIndex === schemaRef.value.length ? schemaRef.value.length : atIndex + 1,
        0,
        ..._schemas
      )
    }

    // schemaRef.value = [...schemaRef.value]

    console.log('schemaRef.value', schemaRef.value)
  }

  return {
    schemaRef,
    updateSchemas,
    appendSchemaByField
  }
}
