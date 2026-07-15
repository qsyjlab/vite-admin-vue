import { nextTick, shallowRef, type ShallowRef } from 'vue'
import type { ProTableInstance } from './pro-table'

export type ProTableTemplateRef<TRecord extends object> = Readonly<
  ShallowRef<ProTableInstance<TRecord> | null>
>

export function useProTable<TRecord extends object>(templateRef?: ProTableTemplateRef<TRecord>) {
  const tableRef = templateRef ?? shallowRef<ProTableInstance<TRecord> | null>(null)

  async function getTable() {
    await nextTick()
    const instance = tableRef.value
    if (!instance) throw new Error('ProTable instance is not available')
    return instance
  }

  return {
    tableRef,
    getTable,
    async reload(resetPage = true) {
      return (await getTable()).reload(resetPage)
    },
    async refresh() {
      return (await getTable()).refresh()
    },
    async getData() {
      return (await getTable()).getData()
    },
    async getLoading() {
      return (await getTable()).getLoading()
    },
    async getPageInfo() {
      return (await getTable()).getPageInfo()
    },
    async getTotal() {
      return (await getTable()).getTotal()
    },
    async getServerState() {
      return (await getTable()).getServerState()
    },
    async getRequestLifecycle() {
      return (await getTable()).getRequestLifecycle()
    },
    async getError() {
      return (await getTable()).getError()
    },
    async retryRequest() {
      return (await getTable()).retryRequest()
    },
    async cancelRequest(reason?: unknown) {
      ;(await getTable()).cancelRequest(reason)
    },
    async getSelectedKeys() {
      return (await getTable()).getSelectedKeys()
    },
    async setPageInfo(
      pageInfo: Parameters<ProTableInstance<TRecord>['setPageInfo']>[0],
      reload = true
    ) {
      return (await getTable()).setPageInfo(pageInfo, reload)
    },
    async setSorter(sorter: Parameters<ProTableInstance<TRecord>['setSorter']>[0], reload = true) {
      return (await getTable()).setSorter(sorter, reload)
    },
    async setFilters(
      filters: Parameters<ProTableInstance<TRecord>['setFilters']>[0],
      reload = true
    ) {
      return (await getTable()).setFilters(filters, reload)
    },
    async resetServerState(reload = true) {
      return (await getTable()).resetServerState(reload)
    },
    async clearSelection() {
      ;(await getTable()).clearSelection()
    },
    async clearSelectedKeys() {
      ;(await getTable()).clearSelectedKeys()
    },
    async getSelectedRows() {
      return (await getTable()).getSelectedRows()
    },
    async doLayout() {
      ;(await getTable()).doLayout()
    },
    async doHeight() {
      ;(await getTable()).doHeight()
    },
    async startEditable(rowKey: string | number) {
      return (await getTable()).startEditable(rowKey)
    },
    async cancelEditable(rowKey: string | number) {
      return (await getTable()).cancelEditable(rowKey)
    },
    async saveEditable(rowKey: string | number) {
      return (await getTable()).saveEditable(rowKey)
    },
    async deleteEditable(rowKey: string | number) {
      return (await getTable()).deleteEditable(rowKey)
    },
    async clearEditRows() {
      ;(await getTable()).clearEditRows()
    },
    async hasEditingRow() {
      return (await getTable()).hasEditingRow()
    },
    async getEditableKeys() {
      return (await getTable()).getEditableKeys()
    },
    async validateEditable(rowKey?: string | number) {
      return (await getTable()).validateEditable(rowKey)
    },
    async saveAllEditable() {
      return (await getTable()).saveAllEditable()
    },
    async cancelAllEditable() {
      return (await getTable()).cancelAllEditable()
    },
    async getRowEditableState(rowKey: string | number) {
      return (await getTable()).getRowEditableState(rowKey)
    }
  }
}
