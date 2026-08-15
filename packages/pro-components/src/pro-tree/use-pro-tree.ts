import { nextTick, shallowRef, type ShallowRef } from 'vue'
import type { ProTreeInstance } from './pro-tree'

export type ProTreeTemplateRef<TNode extends object> = Readonly<
  ShallowRef<ProTreeInstance<TNode> | null>
>

export function useProTree<TNode extends object>(templateRef?: ProTreeTemplateRef<TNode>) {
  const treeRef = templateRef ?? shallowRef<ProTreeInstance<TNode> | null>(null)

  async function getTree() {
    await nextTick()
    if (!treeRef.value) throw new Error('ProTree instance is not available')
    return treeRef.value
  }

  return {
    treeRef,
    getTree,
    async getData() {
      return (await getTree()).getData()
    },
    async reload() {
      return (await getTree()).reload()
    },
    async retryRequest() {
      return (await getTree()).retryRequest()
    },
    async cancelRequest(reason?: unknown) {
      ;(await getTree()).cancelRequest(reason)
    },
    async getRequestLifecycle() {
      return (await getTree()).getRequestLifecycle()
    },
    async getError() {
      return (await getTree()).getError()
    },
    async filter(keyword: string) {
      ;(await getTree()).filter(keyword)
    },
    async getCheckedKeys() {
      return (await getTree()).getCheckedKeys()
    },
    async getCheckedNodes() {
      return (await getTree()).getCheckedNodes()
    },
    async setCheckedKeys(keys: Parameters<ProTreeInstance<TNode>['setCheckedKeys']>[0]) {
      ;(await getTree()).setCheckedKeys(keys)
    },
    async getCurrentKey() {
      return (await getTree()).getCurrentKey()
    },
    async setCurrentKey(key?: Parameters<ProTreeInstance<TNode>['setCurrentKey']>[0]) {
      ;(await getTree()).setCurrentKey(key)
    },
    async expandAll() {
      ;(await getTree()).expandAll()
    },
    async collapseAll() {
      ;(await getTree()).collapseAll()
    }
  }
}
