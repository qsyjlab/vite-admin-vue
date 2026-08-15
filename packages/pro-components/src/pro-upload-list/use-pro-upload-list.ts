import { nextTick, type Ref } from 'vue'
import type { ProUploadListExpose, ProUploadListFile } from './pro-upload-list'

export function useProUploadList<
  TResponse = unknown,
  TFile extends ProUploadListFile<TResponse> = ProUploadListFile<TResponse>
>(listRef: Readonly<Ref<ProUploadListExpose<TResponse, TFile> | null>>) {
  async function getUploadList() {
    await nextTick()
    if (!listRef.value) throw Error('The upload list instance is not available')
    return listRef.value
  }

  return {
    open: async () => (await getUploadList()).open(),
    openPreview: async () => (await getUploadList()).openPreview(),
    close: async () => (await getUploadList()).close(),
    uploadAll: async () => (await getUploadList()).uploadAll(),
    clear: async () => (await getUploadList()).clear(),
    getFiles: async () => (await getUploadList()).files.value,
    getUploadList
  }
}
