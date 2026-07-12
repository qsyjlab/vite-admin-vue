import { nextTick, shallowRef, type ShallowRef } from 'vue'
import type { ProChoiceValue } from '../shared/pro-option'
import type { ProRadioGroupInstance } from './pro-radio-group'

export type ProRadioGroupTemplateRef<TValue extends ProChoiceValue = ProChoiceValue> = Readonly<
  ShallowRef<ProRadioGroupInstance<TValue> | null>
>

export function useProRadioGroup<TValue extends ProChoiceValue = ProChoiceValue>(
  templateRef?: ProRadioGroupTemplateRef<TValue>
) {
  const radioGroupRef = templateRef ?? shallowRef<ProRadioGroupInstance<TValue> | null>(null)

  async function getRadioGroup() {
    await nextTick()
    const instance = radioGroupRef.value
    if (!instance) throw new Error('ProRadioGroup instance is not available')
    return instance
  }

  return {
    radioGroupRef,
    getRadioGroup,
    async focus() {
      ;(await getRadioGroup()).focus()
    },
    async blur() {
      ;(await getRadioGroup()).blur()
    }
  }
}
