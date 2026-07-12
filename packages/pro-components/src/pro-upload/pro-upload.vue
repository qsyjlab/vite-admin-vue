<template>
  <el-upload
    ref="uploadRef"
    v-model:file-list="internalFiles"
    :class="['pro-upload', { 'is-trigger-hidden': triggerHidden }]"
    :action="action"
    :accept="accept"
    :auto-upload="autoUpload"
    :before-remove="beforeRemove"
    :before-upload="handleBeforeUpload"
    :data="data"
    :disabled="disabled"
    :drag="drag"
    :headers="headers"
    :http-request="httpRequest"
    :limit="limit"
    :list-type="listType"
    :method="method"
    :multiple="multiple"
    :name="name"
    :show-file-list="showFileList"
    :with-credentials="withCredentials"
    v-bind="attrs"
    :on-error="handleError"
    :on-exceed="handleExceed"
    :on-preview="handlePreview"
    :on-progress="handleProgress"
    :on-remove="handleRemoveEvent"
    :on-success="handleSuccess"
    @change="handleChange"
  >
    <slot v-if="!triggerHidden">
      <el-button :icon="UploadFilled" type="primary">选择文件</el-button>
    </slot>

    <template #file="{ file }">
      <slot name="file" :file="toTypedFile(file)" />
    </template>

    <template v-if="showTip" #tip>
      <slot name="tip" :tip="tipText">
        <div v-if="tipText" class="el-upload__tip">{{ tipText }}</div>
      </slot>
    </template>
  </el-upload>

  <pro-preview-file ref="previewRef" />
</template>

<script
  setup
  lang="ts"
  generic="TResponse = unknown, TFile extends ProUploadFile<TResponse> = ProUploadFile<TResponse>"
>
import { computed, ref, useAttrs, watch, type Ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import {
  ElButton,
  ElMessage,
  ElUpload,
  type UploadFile,
  type UploadInstance,
  type UploadProgressEvent,
  type UploadRawFile,
  type UploadUserFile
} from 'element-plus'
import { bytesToSize } from '../shared/file'
import {
  ProPreviewFile,
  type ProPreviewFileInstance,
  type ProPreviewFileSource
} from '../pro-preview-file'
import type { ProUploadExpose, ProUploadFile, ProUploadProps } from './pro-upload'
import { cloneProUploadFiles, validateProUploadFile } from './pro-upload-utils'

defineOptions({ name: 'ProUpload', inheritAttrs: false })

const props = withDefaults(defineProps<ProUploadProps<TResponse, TFile>>(), {
  action: '',
  autoUpload: false,
  listType: 'text',
  modelValue: () => [],
  maxSize: 20 * 1024 * 1024,
  showFileList: true,
  showTip: true
})
const emit = defineEmits<{
  'update:model-value': [files: TFile[]]
  change: [file: TFile, files: TFile[]]
  remove: [file: TFile, files: TFile[]]
  success: [response: TResponse, file: TFile, files: TFile[]]
  error: [error: Error, file?: TFile, files?: TFile[]]
  progress: [event: UploadProgressEvent, file: TFile, files: TFile[]]
  exceed: [files: File[], uploadFiles: TFile[]]
  validationError: [reason: 'accept' | 'size' | 'request', file: File]
}>()
defineSlots<{
  default?: () => unknown
  file?: (scope: { file: TFile }) => unknown
  tip?: (scope: { tip: string }) => unknown
}>()

const attrs = useAttrs()
const uploadRef = ref<UploadInstance>()
const previewRef = ref<ProPreviewFileInstance<ProPreviewFileSource>>()
const internalFiles = ref(cloneProUploadFiles(props.modelValue)) as Ref<TFile[]>
const files = computed(() => internalFiles.value)
const triggerHidden = computed(
  () => props.limit !== undefined && internalFiles.value.length >= props.limit
)
const tipText = computed(() => {
  const tips: string[] = []
  if (props.accept) tips.push(`支持 ${props.accept}`)
  if (props.maxSize) tips.push(`单个文件不超过 ${bytesToSize(props.maxSize)}`)
  return tips.join('，')
})

watch(
  () => props.modelValue,
  value => {
    internalFiles.value = cloneProUploadFiles(value)
  },
  { deep: true }
)

async function handleBeforeUpload(file: UploadRawFile) {
  const validationError = validateProUploadFile(file, {
    accept: props.accept,
    maxSize: props.maxSize
  })

  if (validationError) {
    const message =
      validationError === 'size'
        ? `文件大小不能超过 ${bytesToSize(props.maxSize || 0)}`
        : '文件类型不符合上传要求'
    ElMessage.warning(message)
    emit('validationError', validationError, file)
    return false
  }

  if (props.autoUpload && !props.httpRequest && !props.action) {
    const error = new Error('Auto upload requires action or httpRequest')
    emit('validationError', 'request', file)
    emit('error', error)
    return false
  }

  return props.beforeUpload ? props.beforeUpload(file) : true
}

function emitFiles() {
  emit('update:model-value', cloneProUploadFiles(internalFiles.value))
}

function handleChange(file: UploadFile, fileList: UploadFile[]) {
  internalFiles.value = cloneProUploadFiles(fileList) as TFile[]
  emitFiles()
  emit('change', file as TFile, cloneProUploadFiles(internalFiles.value))
}

function handleRemoveEvent(file: UploadFile, fileList: UploadFile[]) {
  internalFiles.value = cloneProUploadFiles(fileList) as TFile[]
  emitFiles()
  emit('remove', file as TFile, cloneProUploadFiles(internalFiles.value))
}

function handleSuccess(response: TResponse, file: UploadFile, fileList: UploadFile[]) {
  internalFiles.value = cloneProUploadFiles(fileList) as TFile[]
  emitFiles()
  emit('success', response, file as TFile, cloneProUploadFiles(internalFiles.value))
}

function handleError(error: Error, file: UploadFile, fileList: UploadFile[]) {
  internalFiles.value = cloneProUploadFiles(fileList) as TFile[]
  emitFiles()
  emit('error', error, file as TFile, cloneProUploadFiles(internalFiles.value))
}

function handleProgress(event: UploadProgressEvent, file: UploadFile, fileList: UploadFile[]) {
  internalFiles.value = cloneProUploadFiles(fileList) as TFile[]
  emitFiles()
  emit('progress', event, file as TFile, cloneProUploadFiles(internalFiles.value))
}

function handleExceed(selectedFiles: File[], uploadFiles: UploadUserFile[]) {
  emit('exceed', selectedFiles, cloneProUploadFiles(uploadFiles) as TFile[])
}

function toTypedFile(file: UploadFile) {
  return file as TFile
}

function handlePreview(file: UploadFile) {
  const typedFile = file as TFile
  if (props.preview?.(typedFile) === false) return
  previewRef.value?.show(typedFile)
}

const exposed: ProUploadExpose<TResponse, TFile> = {
  uploadRef,
  files,
  submit: () => uploadRef.value?.submit(),
  abort: file => {
    if (file) uploadRef.value?.abort(file)
  },
  clearFiles: states => uploadRef.value?.clearFiles(states),
  handleStart: file => uploadRef.value?.handleStart(file),
  handleRemove: file => {
    if (file) uploadRef.value?.handleRemove(file)
  }
}

defineExpose(exposed)
</script>

<style scoped lang="scss">
.pro-upload {
  &.is-trigger-hidden {
    :deep(.el-upload--picture-card),
    :deep(.el-upload--text.is-drag) {
      display: none;
    }
  }

  :deep(.el-upload--picture-card),
  :deep(.el-upload-list--picture-card) {
    --el-upload-picture-card-size: 104px;
    --el-upload-list-picture-card-size: 104px;
  }
}
</style>
