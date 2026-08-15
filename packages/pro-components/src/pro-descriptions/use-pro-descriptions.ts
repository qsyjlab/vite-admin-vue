import { nextTick, shallowRef, type ShallowRef } from 'vue'
import type { ProDescriptionsInstance, ProDescriptionsExpose } from './pro-descriptions'

export type ProDescriptionsTemplateRef<
  TRecord extends object,
  TParams extends object = Record<string, never>
> = Readonly<ShallowRef<ProDescriptionsInstance<TRecord, TParams> | null>>

export function useProDescriptions<
  TRecord extends object,
  TParams extends object = Record<string, never>
>(templateRef?: ProDescriptionsTemplateRef<TRecord, TParams>) {
  const descriptionsRef =
    templateRef ?? shallowRef<ProDescriptionsInstance<TRecord, TParams> | null>(null)

  async function getDescriptions(): Promise<ProDescriptionsExpose<TRecord, TParams>> {
    await nextTick()
    const instance = descriptionsRef.value
    if (!instance) throw new Error('ProDescriptions instance is not available')
    return instance
  }

  return {
    descriptionsRef,
    getDescriptions,
    async reload(params?: TParams) {
      return (await getDescriptions()).reload(params)
    },
    async getData() {
      return (await getDescriptions()).getData()
    },
    async setData(data?: TRecord) {
      ;(await getDescriptions()).setData(data)
    },
    async getLoading() {
      return (await getDescriptions()).getLoading()
    },
    async getRequestLifecycle() {
      return (await getDescriptions()).getRequestLifecycle()
    },
    async getError() {
      return (await getDescriptions()).getError()
    },
    async retryRequest() {
      return (await getDescriptions()).retryRequest()
    },
    async cancelRequest(reason?: unknown) {
      ;(await getDescriptions()).cancelRequest(reason)
    },
    async getCollapsed() {
      return (await getDescriptions()).getCollapsed()
    },
    async setCollapsed(collapsed: boolean) {
      ;(await getDescriptions()).setCollapsed(collapsed)
    },
    async toggleCollapse() {
      ;(await getDescriptions()).toggleCollapse()
    }
  }
}
