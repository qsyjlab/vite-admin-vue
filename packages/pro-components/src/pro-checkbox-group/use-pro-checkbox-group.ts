import { nextTick, shallowRef, type ShallowRef } from 'vue'
import type { ProCheckboxGroupInstance, ProCheckboxValue } from './pro-checkbox-group'

export type ProCheckboxGroupTemplateRef<TValue extends ProCheckboxValue = ProCheckboxValue> =
  Readonly<ShallowRef<ProCheckboxGroupInstance<TValue> | null>>

export function useProCheckboxGroup<TValue extends ProCheckboxValue = ProCheckboxValue>(
  templateRef?: ProCheckboxGroupTemplateRef<TValue>
) {
  const checkboxGroupRef = templateRef ?? shallowRef<ProCheckboxGroupInstance<TValue> | null>(null)

  async function getCheckboxGroup() {
    await nextTick()
    const instance = checkboxGroupRef.value
    if (!instance) throw new Error('ProCheckboxGroup instance is not available')
    return instance
  }

  return {
    checkboxGroupRef,
    getCheckboxGroup,
    async focus() {
      ;(await getCheckboxGroup()).focus()
    },
    async blur() {
      ;(await getCheckboxGroup()).blur()
    }
  }
}
