import { nextTick, shallowRef, type ShallowRef } from 'vue'
import type {
  ProSelectInstance,
  ProSelectOption,
  ProSelectParams,
  ProSelectRequestQuery
} from './pro-select'

export type ProSelectTemplateRef<TInstance> = Readonly<ShallowRef<TInstance | null>>

export function useProSelect<
  TOption extends object = ProSelectOption,
  TParams extends ProSelectParams = ProSelectParams
>(templateRef?: ProSelectTemplateRef<ProSelectInstance<TOption, TParams>>) {
  const selectRef = templateRef ?? shallowRef<ProSelectInstance<TOption, TParams> | null>(null)

  async function getSelect() {
    await nextTick()
    const instance = selectRef.value
    if (!instance) throw new Error('ProSelect instance is not available')
    return instance
  }

  return {
    selectRef,
    getSelect,
    async reload(params?: Partial<TParams> & ProSelectRequestQuery) {
      return (await getSelect()).reload(params)
    },
    async clearOptions() {
      ;(await getSelect()).clearOptions()
    },
    async focus() {
      ;(await getSelect()).focus()
    },
    async blur() {
      ;(await getSelect()).blur()
    }
  }
}
