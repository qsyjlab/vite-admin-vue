<template>
  <el-upload
    v-model:file-list="fileList"
    :on-success="success"
    :http-request="httpRequest"
    :on-preview="preview"
    :on-exceed="exceed"
    :multiple="multiple"
    :limit="limit"
    :list-type="listType"
    :drag="drag"
    :class="['upload', isHideUploadTrigger() ? 'hide-trigger' : '']"
    :autoUpload="autoUpload"
    :accept="accept"
    @change="change"
    v-bind="$attrs"
  >
    <slot v-if="!isHideUploadTrigger()"></slot>
    <template #file="{ file }">
      <slot name="file" :file="file"></slot>
    </template>

    <template #tip>
      <slot name="tip">
        <div class="el-upload__tip">{{ getTipsString() }}</div>
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
import { ref, watch } from 'vue'
import { bytesToSize } from '@/utils'
import { ElUpload, ElImageViewer } from 'element-plus'
import 'element-plus/es/components/image-viewer/style/css'

import type { UploadProps } from 'element-plus'
import { reactive } from 'vue'
defineSlots<{
  default: () => void
  file: (scope: { file: UploadProps['fileList'][number] }) => void
  tip: () => void
}>()

defineOptions({
  name: 'Upload'
})

interface IProps {
  modelValue?: any[]
  size?: number
}

type UploadPropsExtend = Pick<
  UploadProps,
  | 'limit'
  | 'listType'
  | 'multiple'
  | 'drag'
  | 'showFileList'
  | 'accept'
  | 'onExceed'
  | 'onSuccess'
  | 'autoUpload'
  | 'httpRequest'
  | 'disabled'
>

const props = withDefaults(defineProps<Partial<UploadPropsExtend> & IProps>(), {
  listType: 'text',
  autoUpload: true,
  modelValue: () => [],

  size: 1024 * 1024 * 20
})

const emits = defineEmits<{
  change: Parameters<UploadProps['onChange']>
  'update:model-value': [files: UploadProps['fileList']]
}>()

const viewerState = reactive({
  visible: false,
  src: ''
})

const fileList = ref<UploadProps['fileList']>([])

watch(
  () => props.modelValue,
  newval => {
    fileList.value = newval
  },
  {
    immediate: true
  }
)

watch(
  () => viewerState.visible,
  newVal => {
    if (newVal) {
      document.body.classList.add('uplode-viewer--hidden')
    } else {
      document.body.classList.remove('uplode-viewer--hidden')
    }
  }
)

const getTipsString = () => {
  const tips: string[] = []
  if (props.accept) {
    tips.push(props.accept)
  }
  if (props.size) {
    tips.push(`文件大小不超过 ${bytesToSize(props.size)}`)
  }
  return tips.join(',')
}

const httpRequest: UploadProps['httpRequest'] = uploadOption => {
  if (props.httpRequest) {
    return props.httpRequest(uploadOption)
  }
  return Promise.reject('upload error')
}

const change: UploadProps['onChange'] = (file, files) => {
  emits('change', file, files)

  emits('update:model-value', files)
}

const preview: UploadProps['onPreview'] = file => {
  if (!file.raw) return
  const blob = new Blob([file.raw], { type: file.raw?.type })

  viewerState.src = URL.createObjectURL(blob)
  viewerState.visible = true
}

const success: UploadProps['onSuccess'] = (response, file, files) => {
  if (props.onSuccess) {
    props.onSuccess(response, file, files)
    return
  }
}

const exceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  if (props.onExceed) {
    props.onExceed?.(files, uploadFiles)
    return
  }
}

const closeViewer = () => {
  viewerState.visible = false
}

const isHideUploadTrigger = () => {
  return !(props.limit && fileList.value.length < props.limit)
}
</script>
<style lang="scss" scoped>
// 避免在某些可能得情况错误的移除 el-popup-parent--hidden
// 样式作用与提升至全局
:global(.uplode-viewer--hidden) {
  overflow: hidden;
}

// picture-card 模式下 limit 不隐藏上传按钮
.hide-trigger {
  :deep(.el-upload--picture-card) {
    display: none;
  }

  :deep(.el-upload--text.is-drag) {
    display: none;
  }
}

$picture-card-size: 100px;

:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: #{$picture-card-size} !important;
}

:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: #{$picture-card-size} !important;
}
</style>
