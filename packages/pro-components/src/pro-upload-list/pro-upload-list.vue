<template>
  <span class="pro-upload-list-trigger">
    <slot name="trigger" :open="open" :open-preview="openPreview" :count="files.length">
      <el-button :icon="UploadFilled" type="primary" :disabled="disabled" @click="open">
        上传文件
      </el-button>
      <el-tooltip content="查看文件" placement="top">
        <el-button
          aria-label="查看文件"
          :icon="View"
          :disabled="files.length === 0"
          @click="openPreview"
        />
      </el-tooltip>
      <el-tag v-if="files.length" type="info" effect="plain">{{ files.length }} 个文件</el-tag>
    </slot>
  </span>

  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="min(960px, calc(100vw - 32px))"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
  >
    <div v-if="mode === 'upload' && !readonly" class="pro-upload-list__picker">
      <pro-upload
        v-model="internalFiles"
        :accept="accept"
        :disabled="disabled"
        :limit="limit"
        :max-size="maxSize"
        :multiple="multiple"
        :show-file-list="false"
        @change="handleFileChange"
        @validation-error="(reason, file) => emit('validationError', reason, file)"
      >
        <el-button :icon="Plus" :disabled="disabled">选择文件</el-button>
      </pro-upload>
      <span class="pro-upload-list__summary">{{ statusSummary }}</span>
    </div>

    <el-table :data="internalFiles" class="pro-upload-list__table" table-layout="fixed">
      <el-table-column label="文件名" min-width="220" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="pro-upload-list__name">
            <el-icon><Document /></el-icon>
            <span>{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="110">
        <template #default="{ row }">{{ bytesToSize(row.size || 0) }}</template>
      </el-table-column>
      <el-table-column label="进度" width="150">
        <template #default="{ row }">
          <el-progress
            :percentage="normalizeProUploadPercentage(row.percentage)"
            :status="
              row.status === 'fail' ? 'exception' : row.status === 'success' ? 'success' : ''
            "
            :stroke-width="8"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="105">
        <template #default="{ row }">
          <el-tag :type="getStatusMeta(row).type" effect="light">
            {{ getStatusMeta(row).text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170" fixed="right">
        <template #default="{ row }">
          <div class="pro-upload-list__actions">
            <el-tooltip content="预览" placement="top">
              <el-button aria-label="预览文件" link :icon="View" @click="preview(row)" />
            </el-tooltip>
            <el-tooltip content="下载" placement="top">
              <el-button
                aria-label="下载文件"
                link
                :icon="Download"
                :disabled="!getFileSource(row)"
                @click="download(row)"
              />
            </el-tooltip>
            <el-tooltip v-if="row.status === 'fail'" content="重试" placement="top">
              <el-button
                aria-label="重试上传"
                link
                :icon="RefreshRight"
                type="primary"
                @click="retry(row)"
              />
            </el-tooltip>
            <el-tooltip v-if="row.status === 'uploading'" content="取消" placement="top">
              <el-button
                aria-label="取消上传"
                link
                :icon="CircleClose"
                type="warning"
                @click="abort(row)"
              />
            </el-tooltip>
            <el-popconfirm
              v-if="mode === 'upload' && !readonly"
              title="确认移除这个文件？"
              @confirm="remove(row)"
            >
              <template #reference>
                <el-button aria-label="移除文件" link :icon="Delete" type="danger" />
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <pro-empty title="暂无文件" description="上传后的文件会显示在这里" compact />
      </template>
    </el-table>

    <template #footer>
      <el-button @click="close">关闭</el-button>
      <el-button
        v-if="mode === 'upload' && !readonly"
        type="primary"
        :loading="uploading"
        :disabled="!canUpload"
        @click="uploadAll"
      >
        开始上传
      </el-button>
    </template>
  </el-dialog>

  <pro-preview-file ref="previewRef" />
</template>

<script
  setup
  lang="ts"
  generic="
    TResponse = unknown,
    TFile extends ProUploadListFile<TResponse> = ProUploadListFile<TResponse>
  "
>
import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import {
  CircleClose,
  Delete,
  Document,
  Download,
  Plus,
  RefreshRight,
  UploadFilled,
  View
} from '@element-plus/icons-vue'
import {
  ElButton,
  ElDialog,
  ElIcon,
  ElMessage,
  ElPopconfirm,
  ElProgress,
  ElTable,
  ElTableColumn,
  ElTag,
  ElTooltip,
  genFileId
} from 'element-plus'
import { ProEmpty } from '../pro-empty'
import { bytesToSize } from '../shared/file'
import {
  ProPreviewFile,
  type ProPreviewFileInstance,
  getProPreviewFileValue
} from '../pro-preview-file'
import { ProUpload } from '../pro-upload'
import type {
  ProUploadListExpose,
  ProUploadListFile,
  ProUploadListMode,
  ProUploadListProps
} from './pro-upload-list'
import { normalizeProUploadPercentage, proUploadStatusMap } from './pro-upload-list-utils'

defineOptions({ name: 'ProUploadList', inheritAttrs: false })

const props = withDefaults(defineProps<ProUploadListProps<TResponse, TFile>>(), {
  modelValue: () => [],
  multiple: true,
  autoUpload: false,
  maxSize: 20 * 1024 * 1024,
  readonly: false,
  disabled: false
})
const emit = defineEmits<{
  'update:model-value': [files: TFile[]]
  change: [files: TFile[]]
  success: [response: TResponse, file: TFile]
  error: [error: unknown, file: TFile]
  remove: [file: TFile]
  validationError: [reason: 'accept' | 'size' | 'request', file: File]
}>()
defineSlots<{
  trigger?: (scope: { open: () => void; openPreview: () => void; count: number }) => unknown
}>()

const visible = ref(false)
const mode = ref<ProUploadListMode>('upload')
const internalFiles = ref(normalizeFiles(props.modelValue)) as Ref<TFile[]>
const files = computed(() => internalFiles.value)
const previewRef = ref<ProPreviewFileInstance<TFile>>()
const controllers = new Map<number, AbortController>()
const objectUrls = new Set<string>()

const uploading = computed(() => internalFiles.value.some(file => file.status === 'uploading'))
const canUpload = computed(
  () =>
    Boolean(props.request) &&
    internalFiles.value.some(file => file.status === 'ready' || file.status === 'fail')
)
const dialogTitle = computed(
  () => props.title || (mode.value === 'preview' ? '文件列表' : '上传文件')
)
const statusSummary = computed(() => {
  const ready = internalFiles.value.filter(file => file.status === 'ready').length
  const success = internalFiles.value.filter(file => file.status === 'success').length
  return `${internalFiles.value.length} 个文件，${ready} 个待上传，${success} 个已完成`
})

watch(
  () => props.modelValue,
  value => {
    internalFiles.value = normalizeFiles(value)
  },
  { deep: true }
)

function normalizeFiles(inputFiles: TFile[]): TFile[] {
  return inputFiles.map(file => ({
    ...file,
    uid: file.uid ?? genFileId(),
    status: file.status || (file.url ? 'success' : 'ready'),
    percentage: file.percentage ?? (file.status === 'success' || file.url ? 100 : 0)
  })) as TFile[]
}

function emitFiles() {
  const nextFiles = internalFiles.value.map(file => ({ ...file })) as TFile[]
  emit('update:model-value', nextFiles)
  emit('change', nextFiles)
}

function open() {
  mode.value = 'upload'
  visible.value = true
}

function openPreview() {
  mode.value = 'preview'
  visible.value = true
}

function close() {
  visible.value = false
}

function handleFileChange(_file: TFile, selectedFiles: TFile[]) {
  internalFiles.value = normalizeFiles(selectedFiles).map(file => {
    if (!file.url && file.raw) {
      const url = URL.createObjectURL(file.raw)
      objectUrls.add(url)
      return { ...file, url }
    }
    return file
  }) as TFile[]
  emitFiles()

  if (props.autoUpload) {
    const addedFile = internalFiles.value.find(file => file.uid === _file.uid)
    if (addedFile) void upload(addedFile)
  }
}

async function upload(file: TFile): Promise<boolean> {
  if (!props.request) {
    ElMessage.warning('请先配置上传请求')
    return false
  }
  if (!file.raw) {
    file.status = 'fail'
    file.error = new Error('The raw file is missing')
    emitFiles()
    return false
  }

  const uid = file.uid ?? genFileId()
  file.uid = uid
  controllers.get(uid)?.abort()
  const controller = new AbortController()
  controllers.set(uid, controller)
  file.status = 'uploading'
  file.percentage = 0
  file.error = undefined
  emitFiles()

  try {
    const response = await props.request(file.raw, {
      file,
      signal: controller.signal,
      onProgress: percentage => {
        file.percentage = normalizeProUploadPercentage(percentage)
        emitFiles()
      }
    })
    if (controller.signal.aborted) return false

    Object.assign(file, props.mapResponse?.(response, file) || {})
    file.response = response
    file.status = 'success'
    file.percentage = 100
    emitFiles()
    emit('success', response, file)
    return true
  } catch (error) {
    if (controller.signal.aborted) {
      file.status = 'ready'
      file.percentage = 0
    } else {
      file.status = 'fail'
      file.error = error
      emit('error', error, file)
    }
    emitFiles()
    return false
  } finally {
    controllers.delete(uid)
  }
}

function uploadAll() {
  const pendingFiles = internalFiles.value.filter(
    file => file.status === 'ready' || file.status === 'fail'
  )
  return Promise.all(pendingFiles.map(upload))
}

function retry(file: TFile) {
  return upload(file)
}

function abort(file?: TFile) {
  if (file?.uid !== undefined) {
    controllers.get(file.uid)?.abort()
    return
  }
  controllers.forEach(controller => controller.abort())
}

function remove(file: TFile) {
  abort(file)
  internalFiles.value = internalFiles.value.filter(item => item.uid !== file.uid)
  revokeFileUrl(file)
  emitFiles()
  emit('remove', file)
}

function clear() {
  abort()
  internalFiles.value.forEach(revokeFileUrl)
  internalFiles.value = []
  emitFiles()
}

function preview(file: TFile) {
  previewRef.value?.show(file)
}

function getFileSource(file: TFile) {
  return getProPreviewFileValue(file)
}

function download(file: TFile) {
  const source = getFileSource(file)
  if (!source) return
  const url = typeof source === 'string' ? source : URL.createObjectURL(source)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = file.name
  anchor.click()
  if (typeof source !== 'string') URL.revokeObjectURL(url)
}

function getStatusMeta(file: TFile) {
  return proUploadStatusMap[file.status || 'ready']
}

function revokeFileUrl(file: TFile) {
  if (!file.url || !objectUrls.has(file.url)) return
  URL.revokeObjectURL(file.url)
  objectUrls.delete(file.url)
}

onBeforeUnmount(() => {
  abort()
  objectUrls.forEach(url => URL.revokeObjectURL(url))
  objectUrls.clear()
})

const exposed: ProUploadListExpose<TResponse, TFile> = {
  visible,
  mode,
  files,
  open,
  openPreview,
  close,
  upload,
  uploadAll,
  abort,
  retry,
  remove,
  clear
}

defineExpose(exposed)
</script>

<style scoped lang="scss">
.pro-upload-list-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.pro-upload-list {
  &__picker {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
  }

  &__summary {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  &__table {
    width: 100%;
  }

  &__name {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

@media (max-width: 640px) {
  .pro-upload-list__picker {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
