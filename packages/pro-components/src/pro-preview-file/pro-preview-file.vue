<template>
  <el-image-viewer
    v-if="visible && kind === 'image' && imageUrl"
    :url-list="[imageUrl]"
    @close="close"
  />

  <el-dialog
    v-else
    v-model="visible"
    class="pro-preview-file"
    fullscreen
    :title="title || currentFile?.name || '文件预览'"
    destroy-on-close
  >
    <div class="pro-preview-file__content">
      <component :is="previewRenderer" v-if="previewRenderer" :file="source" :height="height" />

      <pro-empty
        v-else-if="!source"
        title="尚未选择文件"
        description="选择文件后将在这里显示预览内容"
      />

      <pro-result
        v-else
        status="warning"
        title="暂不支持在线预览"
        :sub-title="currentFile?.name || '当前没有可预览的文件'"
        :primary-text="download && source ? '下载文件' : undefined"
        @primary="downloadFile"
      >
      </pro-result>
    </div>

    <template #footer>
      <el-button v-if="download && source" :icon="Download" @click="downloadFile">下载</el-button>
      <el-button type="primary" @click="close">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" generic="TFile extends ProPreviewFileSource = ProPreviewFileSource">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElButton, ElDialog, ElImageViewer } from 'element-plus'
import ProEmpty from '../pro-empty/pro-empty.vue'
import ProResult from '../pro-result/pro-result.vue'
import type {
  ProPreviewFileExpose,
  ProPreviewFileProps,
  ProPreviewFileSource
} from './pro-preview-file'
import { getProPreviewFileKind, getProPreviewFileValue } from './pro-preview-file-utils'
import { getProPreviewFileRenderer } from './pro-preview-file-registry'

defineOptions({ name: 'ProPreviewFile' })

const props = withDefaults(defineProps<ProPreviewFileProps<TFile>>(), {
  file: null,
  height: 'calc(100vh - 150px)',
  download: true
})
const visible = defineModel<boolean>({ default: false })
const localFile = ref<TFile | null>(props.file)
const objectUrl = ref('')

const currentFile = computed(() => localFile.value || props.file)
const kind = computed(() => getProPreviewFileKind(currentFile.value))
const source = computed(() => getProPreviewFileValue(currentFile.value))
const previewRenderer = computed(() => getProPreviewFileRenderer(kind.value))
const imageUrl = computed(() => {
  if (typeof source.value === 'string') return source.value
  return objectUrl.value
})

watch(
  source,
  value => {
    revokeObjectUrl()
    if (value instanceof Blob) objectUrl.value = URL.createObjectURL(value)
  },
  { immediate: true }
)

watch(
  () => props.file,
  file => {
    if (file) localFile.value = file
  }
)

function show(file: TFile) {
  localFile.value = file
  visible.value = true
}

function close() {
  visible.value = false
}

function downloadFile() {
  const value = source.value
  if (!value) return

  const url = typeof value === 'string' ? value : URL.createObjectURL(value)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = currentFile.value?.name || 'download'
  anchor.click()
  if (typeof value !== 'string') URL.revokeObjectURL(url)
}

function revokeObjectUrl() {
  if (!objectUrl.value) return
  URL.revokeObjectURL(objectUrl.value)
  objectUrl.value = ''
}

onBeforeUnmount(revokeObjectUrl)

const exposed: ProPreviewFileExpose<TFile> = {
  visible,
  file: currentFile,
  kind,
  show,
  close,
  download: downloadFile
}

defineExpose(exposed)
</script>

<style lang="scss">
.pro-preview-file {
  --el-dialog-padding-primary: 16px;

  .el-dialog__body {
    min-width: 0;
    overflow: auto;
  }

  &__content {
    min-width: 0;
  }
}
</style>
