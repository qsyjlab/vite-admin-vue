<template>
  <el-image-viewer
    v-if="visible && isImage(previewState.file)"
    :url-list="[previewState.file?.url]"
    @close="close"
  ></el-image-viewer>

  <el-dialog v-else v-model="visible" class="dialog" fullscreen>
    <div class="content">
      <xlsx-preview v-if="isXlsx(previewState.file)" :file="previewState.file.url"></xlsx-preview>
      <pdf-preview
        v-if="isPdf(previewState.file?.name)"
        :file="previewState.file?.url"
      ></pdf-preview>
      <docx-preview
        v-if="isDocx(previewState.file?.name)"
        :file="previewState.file?.url"
      ></docx-preview>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { PdfPreview } from '@/components/pdf-preview'
import { XlsxPreview } from '@/components/xlsx-preview'
import { DocxPreview } from '@/components/docx-preview'
import { isImage, isXlsx } from './preview-file'
import { isPdf, isDocx } from '@/utils'

const visible = ref(false)
const previewState = reactive<{
  file: any
}>({
  file: null
})

const show = (file: any) => {
  visible.value = true
  previewState.file = file
}

const close = () => {
  visible.value = false
}

defineExpose({
  show,
  close
})
</script>
