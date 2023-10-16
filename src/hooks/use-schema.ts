import { Ref, computed, ref, toRaw, unref } from 'vue'
import { deepMerge, isArray } from '@/utils'

export function useSchema<
  T = any,
  S extends { key: string } = T & { key: string },
  E = Partial<Omit<S, 'key'>> & { key: string } & { [key: string]: any }
>(schemas: S[]) {
  const schemaRef = ref(unref(schemas)) as Ref<S[]>

  const schemaToArray = (schemas: E) => {
    return isArray(schemas) ? schemas : [schemas]
  }

  const updateSchemas = (schemas: E) => {
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
  const appendSchemaByField = (schemas: E, referKey: string, position?: 'after' | 'before') => {
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
  }

  const removeSchemaByField = (key: string | string[]) => {
    schemaRef.value = toRaw(schemaRef.value).filter(sc => {
      return !(isArray(key) ? key : [key]).includes(sc.key)
    })
  }

  return {
    schemaes: computed(() => schemaRef.value),
    getSchemaes: () => schemaRef.value,
    updateSchemas,
    removeSchemaByField,
    appendSchemaByField
  }
}
