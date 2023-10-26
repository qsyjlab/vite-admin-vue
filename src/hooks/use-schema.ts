import { Ref, computed, ref, toRaw, unref } from 'vue'
import { isArray } from '@/utils'

// type Test<T, S extends { key: string } = T & { key: string }, E = S & { [key: string]: any }> = E

type RequiredKey = { key: string }

declare type _DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> & { [key: string]: any } : T[P]
}

export function useSchema<
  T = any,
  S extends RequiredKey = T & { key: string },
  E extends RequiredKey = _DeepPartial<Omit<S, 'key'>> & RequiredKey
>(schemas: S[]) {
  const schemaRef = ref(unref(schemas)) as Ref<S[]>

  const schemaToArray = (schemas: E | E[]) => {
    return isArray(schemas) ? schemas : [schemas]
  }

  const updateSchemas = (schemas: E | E[]) => {
    const _schemas = schemaToArray(schemas)

    _schemas.forEach(schema => {
      const atIndex = schemaRef.value.findIndex(i => i.key === schema.key)

      if (atIndex !== -1) {
        const newVal = Object.assign(schemaRef.value[atIndex], schema)
        schemaRef.value[atIndex] = newVal
      }
    })
  }

  /**
   * position default after
   * @returns
   */
  const appendSchemaByField = (
    schemas: E | E[],
    referKey: string,
    position?: 'after' | 'before'
  ) => {
    const _schemas = schemaToArray(schemas)

    const atIndex = schemaRef.value.findIndex(i => i.key === referKey)
    if (atIndex === -1) return

    if (position === 'before') {
      schemaRef.value.splice(atIndex === 0 ? 0 : atIndex - 1, 0, ...(_schemas as unknown as S[]))
    } else {
      schemaRef.value.splice(
        atIndex === schemaRef.value.length ? schemaRef.value.length : atIndex + 1,
        0,
        ...(_schemas as unknown as S[])
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
