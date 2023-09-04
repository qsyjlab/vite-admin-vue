<template>
  <el-upload
    :on-success="success"
    :on-error="error"
    :http-request="httpRequest"
    :on-preview="preview"
    @change="change"
  >
    <slot></slot>
  </el-upload>

  <el-image-viewer
    v-if="viewerState.visible"
    :url-list="[viewerState.src]"
    @close="closeViewer"
  ></el-image-viewer>
</template>
<script setup lang="ts">
import { ElUpload, ElImageViewer } from 'element-plus'
import 'element-plus/es/components/image-viewer/style/css'

import type { UploadProps } from 'element-plus'
import { reactive } from 'vue'
defineSlots<{
  default: () => void
}>()

defineOptions({
  name: 'Upload'
})

const emits = defineEmits<{
  change: Parameters<UploadProps['onChange']>
}>()
const viewerState = reactive({
  visible: false,
  src: ''
})

const httpRequest: UploadProps['httpRequest'] = uploadOption => {
  const { file } = uploadOption || {}
  return Promise.resolve({
    path: file
  })
}

const change: UploadProps['onChange'] = (file, files) => {
  emits('change', file, files)
}

const preview: UploadProps['onPreview'] = file => {
  if (!file.raw) return
  const blob = new Blob([file.raw], { type: file.raw?.type })

  viewerState.src = URL.createObjectURL(blob)
  viewerState.visible = true
}

const success: UploadProps['onSuccess'] = (response, file, files) => {}

const error: UploadProps['onError'] = () => {}

const closeViewer = () => {
  viewerState.visible = false
}
</script>
<style scoped></style>
