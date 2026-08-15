<template>
  <page-wrapper :full="false" class="pro-upload-demo">
    <header class="pro-upload-demo__header">
      <div>
        <h1>ProUpload</h1>
        <p>受控文件、请求生命周期、预览和 schema 表单组合</p>
      </div>
      <el-tag type="success" effect="plain">请求由业务注入</el-tag>
    </header>

    <div class="pro-upload-demo__grid">
      <section class="demo-panel">
        <div class="demo-panel__heading">
          <div>
            <h2>基础上传</h2>
            <p>类型与大小校验，文件列表完全受控</p>
          </div>
          <span>{{ basicFiles.length }} / 3</span>
        </div>
        <pro-upload
          v-model="basicFiles"
          accept="image/*,.pdf"
          :limit="3"
          :max-size="5 * 1024 * 1024"
        />
      </section>

      <section class="demo-panel">
        <div class="demo-panel__heading">
          <div>
            <h2>图片墙</h2>
            <p>预览能力由 ProPreviewFile 统一提供</p>
          </div>
          <span>picture-card</span>
        </div>
        <pro-upload
          v-model="pictureFiles"
          accept="image/*"
          list-type="picture-card"
          :limit="4"
          :show-tip="false"
        >
          <el-icon><Plus /></el-icon>
        </pro-upload>
      </section>
    </div>

    <section class="demo-panel demo-panel--wide">
      <div class="demo-panel__heading">
        <div>
          <h2>批量上传工作流</h2>
          <p>选择、进度、取消、失败重试、预览与下载在一个独立组件内完成</p>
        </div>
        <div class="demo-panel__actions">
          <el-button :icon="FolderOpened" @click="uploadList.open()">打开上传</el-button>
          <el-button :icon="View" @click="uploadList.openPreview()">查看文件</el-button>
          <el-button :icon="Delete" :disabled="!listFiles.length" @click="uploadList.clear()">
            清空
          </el-button>
        </div>
      </div>

      <pro-upload-list
        ref="uploadListRef"
        v-model="listFiles"
        accept="image/*,.pdf,.xlsx,.docx"
        :request="simulateUpload"
        :map-response="response => response"
        :max-size="10 * 1024 * 1024"
      />
    </section>

    <section class="demo-panel demo-panel--wide">
      <div class="demo-panel__heading">
        <div>
          <h2>ProForm Schema</h2>
          <p>valueType=upload 直接复用同一套上传字段</p>
        </div>
      </div>
      <pro-form :model="formModel" :fields="formFields" :label-width="100" />
    </section>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { Delete, FolderOpened, Plus, View } from '@element-plus/icons-vue'
import { PageWrapper } from '@/components'
import {
  ProForm,
  ProUpload,
  ProUploadList,
  useProUploadList,
  type ProUploadFile,
  type ProUploadListFile,
  type ProUploadListInstance,
  type ProUploadRequestContext,
  type FormSchema
} from '@framebase/element-plus-pro-components'

defineOptions({ name: 'ProUploadPage' })

interface UploadResponse {
  url: string
  uploadedAt: string
}

type DemoFile = ProUploadListFile<UploadResponse>

interface UploadFormModel {
  attachments: DemoFile[]
}

const logoUrl = 'https://element-plus.org/images/element-plus-logo.svg'
const basicFiles = ref<ProUploadFile[]>([])
const pictureFiles = ref<ProUploadFile[]>([
  { name: 'element-plus-logo.svg', url: logoUrl, status: 'success', percentage: 100 }
])
const listFiles = ref<DemoFile[]>([
  { name: 'design-system.svg', url: logoUrl, status: 'success', percentage: 100 }
])

const uploadListRef =
  useTemplateRef<ProUploadListInstance<UploadResponse, DemoFile>>('uploadListRef')
const uploadList = useProUploadList(uploadListRef)

const formModel: UploadFormModel = { attachments: [] }
const formFields: FormSchema<UploadFormModel>[] = [
  {
    key: 'attachments-field',
    name: 'attachments',
    label: '项目附件',
    valueType: 'upload',
    fieldProps: {
      accept: '.pdf,.xlsx,.docx,image/*',
      request: simulateUpload,
      mapResponse: (response: UploadResponse) => response,
      maxSize: 10 * 1024 * 1024
    }
  }
]

async function simulateUpload(
  rawFile: File,
  context: ProUploadRequestContext<DemoFile>
): Promise<UploadResponse> {
  for (const percentage of [20, 45, 75, 100]) {
    await wait(180, context.signal)
    context.onProgress(percentage)
  }

  return {
    url: context.file.url || URL.createObjectURL(rawFile),
    uploadedAt: new Date().toISOString()
  }
}

function wait(duration: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, duration)
    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timer)
        reject(new DOMException('Upload cancelled', 'AbortError'))
      },
      { once: true }
    )
  })
}
</script>

<style scoped lang="scss">
.pro-upload-demo {
  color: var(--el-text-color-primary);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;

    h1 {
      margin: 0;
      font-size: 22px;
      line-height: 1.4;
      font-weight: 600;
    }

    p {
      margin: 3px 0 0;
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
}

.demo-panel {
  min-width: 0;
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  background: var(--el-bg-color);

  &--wide {
    margin-top: 16px;
  }

  &__heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
    }

    p {
      margin: 2px 0 0;
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }

    > span {
      color: var(--el-text-color-secondary);
      font-size: 13px;
      white-space: nowrap;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }
}

@media (max-width: 800px) {
  .pro-upload-demo__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .pro-upload-demo__header,
  .demo-panel__heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .demo-panel__actions {
    justify-content: flex-start;
  }
}
</style>
