import { nextTick, type Ref } from 'vue'
import type { ProUploadExpose, ProUploadFile } from './pro-upload'

export function useProUpload<
  TResponse = unknown,
  TFile extends ProUploadFile<TResponse> = ProUploadFile<TResponse>
>(uploadRef: Readonly<Ref<ProUploadExpose<TResponse, TFile> | null>>) {
  async function getUpload() {
    await nextTick()
    if (!uploadRef.value) throw Error('The upload instance is not available')
    return uploadRef.value
  }

  return {
    submit: async () => (await getUpload()).submit(),
    abort: async () => (await getUpload()).abort(),
    clearFiles: async () => (await getUpload()).clearFiles(),
    getFiles: async () => (await getUpload()).files.value,
    getUpload
  }
}
