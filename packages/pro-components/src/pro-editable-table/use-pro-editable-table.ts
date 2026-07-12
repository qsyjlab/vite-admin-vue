import { nextTick, shallowRef, type ShallowRef } from 'vue'
import type { ProEditableTableInstance } from './pro-editable-table'

export type ProEditableTableTemplateRef<TRecord extends object> = Readonly<
  ShallowRef<ProEditableTableInstance<TRecord> | null>
>

export function useProEditableTable<TRecord extends object>(
  templateRef?: ProEditableTableTemplateRef<TRecord>
) {
  const editableTableRef = templateRef ?? shallowRef<ProEditableTableInstance<TRecord> | null>(null)

  async function getEditableTable() {
    await nextTick()
    const instance = editableTableRef.value
    if (!instance) throw new Error('ProEditableTable instance is not available')
    return instance
  }

  return {
    editableTableRef,
    getEditableTable,
    async addRow() {
      return (await getEditableTable()).addRow()
    },
    async getData() {
      return (await getEditableTable()).getData()
    },
    async getEditableKeys() {
      return (await getEditableTable()).getEditableKeys()
    },
    async startEditable(rowKey: string | number) {
      return (await getEditableTable()).startEditable(rowKey)
    },
    async cancelEditable(rowKey: string | number) {
      return (await getEditableTable()).cancelEditable(rowKey)
    },
    async saveEditable(rowKey: string | number) {
      return (await getEditableTable()).saveEditable(rowKey)
    },
    async deleteEditable(rowKey: string | number) {
      return (await getEditableTable()).deleteEditable(rowKey)
    },
    async getRowEditableState(rowKey: string | number) {
      return (await getEditableTable()).getRowEditableState(rowKey)
    },
    async clearEditRows() {
      ;(await getEditableTable()).clearEditRows()
    },
    async hasEditingRow() {
      return (await getEditableTable()).hasEditingRow()
    },
    async validateEditable(rowKey?: string | number) {
      return (await getEditableTable()).validateEditable(rowKey)
    },
    async saveAllEditable() {
      return (await getEditableTable()).saveAllEditable()
    },
    async cancelAllEditable() {
      return (await getEditableTable()).cancelAllEditable()
    },
    async clearSelection() {
      ;(await getEditableTable()).clearSelection()
    },
    async clearSelectedKeys() {
      ;(await getEditableTable()).clearSelectedKeys()
    },
    async getSelectedRows() {
      return (await getEditableTable()).getSelectedRows()
    },
    async doLayout() {
      ;(await getEditableTable()).doLayout()
    },
    async doHeight() {
      ;(await getEditableTable()).doHeight()
    }
  }
}
