import { nextTick, shallowRef, type ShallowRef } from 'vue'
import type { ProTreeSelectInstance } from './pro-tree'

export type ProTreeSelectTemplateRef<TNode extends object> = Readonly<
  ShallowRef<ProTreeSelectInstance<TNode> | null>
>

export function useProTreeSelect<TNode extends object>(
  templateRef?: ProTreeSelectTemplateRef<TNode>
) {
  const treeSelectRef = templateRef ?? shallowRef<ProTreeSelectInstance<TNode> | null>(null)

  async function getTreeSelect() {
    await nextTick()
    if (!treeSelectRef.value) throw new Error('ProTreeSelect instance is not available')
    return treeSelectRef.value
  }

  return {
    treeSelectRef,
    getTreeSelect,
    async getData() {
      return (await getTreeSelect()).getData()
    },
    async getCacheData() {
      return (await getTreeSelect()).getCacheData()
    },
    async reload() {
      return (await getTreeSelect()).reload()
    },
    async reloadPath() {
      return (await getTreeSelect()).reloadPath()
    },
    async getRequestLifecycle() {
      return (await getTreeSelect()).getRequestLifecycle()
    },
    async getError() {
      return (await getTreeSelect()).getError()
    },
    async retryRequest() {
      return (await getTreeSelect()).retryRequest()
    },
    async cancelRequest(reason?: unknown) {
      ;(await getTreeSelect()).cancelRequest(reason)
    }
  }
}
