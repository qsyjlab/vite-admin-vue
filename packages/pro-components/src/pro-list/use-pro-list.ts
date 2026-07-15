import { nextTick, shallowRef, type ShallowRef } from 'vue'
import type { ProListInstance } from './pro-list'

export type ProListTemplateRef<TRecord extends object> = Readonly<
  ShallowRef<ProListInstance<TRecord> | null>
>

export function useProList<TRecord extends object>(templateRef?: ProListTemplateRef<TRecord>) {
  const listRef = templateRef ?? shallowRef<ProListInstance<TRecord> | null>(null)

  async function getList() {
    await nextTick()
    if (!listRef.value) throw new Error('ProList instance is not available')
    return listRef.value
  }

  return {
    listRef,
    getList,
    async reload(resetPage = true) {
      return (await getList()).reload(resetPage)
    },
    async refresh() {
      return (await getList()).refresh()
    },
    async getData() {
      return (await getList()).getData()
    },
    async getLoading() {
      return (await getList()).getLoading()
    },
    async getRequestLifecycle() {
      return (await getList()).getRequestLifecycle()
    },
    async getError() {
      return (await getList()).getError()
    },
    async retryRequest() {
      return (await getList()).retryRequest()
    },
    async cancelRequest(reason?: unknown) {
      ;(await getList()).cancelRequest(reason)
    },
    async getTotal() {
      return (await getList()).getTotal()
    },
    async getPageInfo() {
      return (await getList()).getPageInfo()
    },
    async setPageInfo(
      pageInfo: Parameters<ProListInstance<TRecord>['setPageInfo']>[0],
      reload = true
    ) {
      return (await getList()).setPageInfo(pageInfo, reload)
    },
    async getSelectedKeys() {
      return (await getList()).getSelectedKeys()
    },
    async getSelectedRows() {
      return (await getList()).getSelectedRows()
    },
    async clearSelection() {
      ;(await getList()).clearSelection()
    }
  }
}
