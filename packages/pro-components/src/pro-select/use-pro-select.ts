import { nextTick, shallowRef, type ShallowRef } from 'vue'
import type {
  ProSelectInstance,
  ProSelectOption,
  ProSelectParams,
  ProSelectRequestQuery
} from './pro-select'

export type ProSelectTemplateRef<
  TOption extends object = ProSelectOption,
  TParams extends ProSelectParams = ProSelectParams
> = Readonly<ShallowRef<ProSelectInstance<TOption, TParams> | null>>

export function useProSelect<
  TOption extends object = ProSelectOption,
  TParams extends ProSelectParams = ProSelectParams
>(templateRef?: ProSelectTemplateRef<TOption, TParams>) {
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
    async reload(params?: Partial<TParams> & ProSelectRequestQuery, force = false) {
      return (await getSelect()).reload(params, force)
    },
    async clearCache() {
      ;(await getSelect()).clearCache()
    },
    async getRequestLifecycle() {
      return (await getSelect()).getRequestLifecycle()
    },
    async getError() {
      return (await getSelect()).getError()
    },
    async retryRequest() {
      return (await getSelect()).retryRequest()
    },
    async cancelRequest(reason?: unknown) {
      ;(await getSelect()).cancelRequest(reason)
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
