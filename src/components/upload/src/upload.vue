<template>
  <el-upload
    :on-success="success"
    :on-error="error"
    :http-request="httpRequest"
    :on-preview="preview"
    v-model:file-list="fileList"
    :on-exceed="exceed"
    :multiple="multiple"
    :limit="limit"
    :list-type="listType"
    :class="[isHideUploadTrigger() ? 'hide-trigger' : '']"
    v-bind="$attrs"
  >
    <slot v-if="!isHideUploadTrigger()"></slot>
    <template #file="{ file }">
      <slot name="file" :file="file"></slot>
    </template>

    <template #tip>
      <slot name="tip">
        <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
      </slot>
    </template>
  </el-upload>

  <el-image-viewer
    v-if="viewerState.visible"
    :url-list="[viewerState.src]"
    @close="closeViewer"
  ></el-image-viewer>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ElUpload, ElImageViewer } from 'element-plus'
import 'element-plus/es/components/image-viewer/style/css'

import type { UploadProps } from 'element-plus'
import { reactive } from 'vue'
defineSlots<{
  default: NOOP
  file: (scope: { file: UploadProps['fileList'][number] }) => void
  tip: NOOP
}>()

defineOptions({
  name: 'Upload'
})

const props = withDefaults(
  defineProps<Partial<Pick<UploadProps, 'limit' | 'listType' | 'multiple'>>>(),
  {
    listType: 'text'
  }
)

const emits = defineEmits<{
  change: Parameters<UploadProps['onChange']>
}>()

const viewerState = reactive({
  visible: false,
  src: ''
})

const fileList = ref<UploadProps['fileList']>([])

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

const exceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  console.log('files, uploadFiles', files, uploadFiles)
}

const closeViewer = () => {
  viewerState.visible = false
}

const isHideUploadTrigger = () => {
  return !(props.limit && fileList.value.length < props.limit)
}
</script>
<style lang="scss" scoped>
.hide-trigger {
  :deep(.el-upload--picture-card) {
    display: none;
  }
}
</style>
