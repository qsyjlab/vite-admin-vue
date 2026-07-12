import { nextTick, type Ref } from 'vue'
import type { ProPreviewFileExpose, ProPreviewFileSource } from './pro-preview-file'

export function useProPreviewFile<TFile extends ProPreviewFileSource>(
  previewRef: Readonly<Ref<ProPreviewFileExpose<TFile> | null>>
) {
  async function getPreview() {
    await nextTick()
    if (!previewRef.value) throw Error('The preview instance is not available')
    return previewRef.value
  }

  return {
    show: async (file: TFile) => (await getPreview()).show(file),
    close: async () => (await getPreview()).close(),
    download: async () => (await getPreview()).download(),
    getPreview
  }
}
