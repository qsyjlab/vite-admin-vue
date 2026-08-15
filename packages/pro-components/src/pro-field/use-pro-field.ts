import { nextTick, shallowRef, type ShallowRef } from 'vue'
import type { ProFieldInstance } from './pro-field'

export type ProFieldTemplateRef<TValue = unknown> = Readonly<
  ShallowRef<ProFieldInstance<TValue> | null>
>

export function useProField<TValue = unknown>(templateRef?: ProFieldTemplateRef<TValue>) {
  const fieldRef = templateRef ?? shallowRef<ProFieldInstance<TValue> | null>(null)

  async function getField() {
    await nextTick()
    const instance = fieldRef.value
    if (!instance) throw new Error('ProField instance is not available')
    return instance
  }

  return {
    fieldRef,
    getField,
    async focus() {
      ;(await getField()).focus()
    },
    async blur() {
      ;(await getField()).blur()
    }
  }
}
