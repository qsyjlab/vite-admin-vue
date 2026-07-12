<template>
  <page-wrapper class="docx-preview-page">
    <!-- 渐变标题区 -->
    <header class="docx-preview-page__header">
      <div class="docx-preview-page__title">
        <div class="docx-preview-page__title-icon">
          <Document />
        </div>
        <div>
          <h1>DOCX 在线预览</h1>
          <p>解析 .docx 文件并在页面中渲染，支持拖拽上传与即时预览，无需安装任何插件。</p>
        </div>
      </div>
      <div class="docx-preview-page__capabilities">
        <el-tag effect="plain" type="primary">拖拽上传</el-tag>
        <el-tag effect="plain" type="success">实时渲染</el-tag>
        <el-tag effect="plain" type="warning">原版式还原</el-tag>
      </div>
    </header>

    <!-- 上传区 -->
    <section class="docx-preview-page__upload">
      <el-upload drag :show-file-list="false" accept=".docx" :http-request="handleUpload">
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">将 .docx 文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">仅支持 .docx 格式文件</div>
        </template>
      </el-upload>
    </section>

    <!-- 文件信息条 -->
    <section v-if="fileInfo.name" class="docx-preview-page__info">
      <div class="docx-preview-page__info-meta">
        <el-icon class="docx-preview-page__info-icon"><Document /></el-icon>
        <div class="docx-preview-page__info-text">
          <span class="docx-preview-page__info-name">{{ fileInfo.name }}</span>
          <span class="docx-preview-page__info-size">{{ formatFileSize(fileInfo.size) }}</span>
        </div>
      </div>
      <el-button text type="danger" @click="clearFile">清除</el-button>
    </section>

    <!-- 预览区 -->
    <section class="docx-preview-page__viewer">
      <div v-if="!docxSrc" class="docx-preview-page__empty">
        <el-icon class="docx-preview-page__empty-icon"><Document /></el-icon>
        <p>上传 .docx 文件后，预览内容将显示在此处</p>
      </div>
      <docx-preview v-else :file="docxSrc"></docx-preview>
    </section>
  </page-wrapper>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { UploadRequestOptions } from 'element-plus'
import { Document, UploadFilled } from '@element-plus/icons-vue'
import { PageWrapper } from '@/components'
import { DocxPreview } from '@/components/docx-preview'

defineOptions({ name: 'DocxPreviewPage' })

// 预览用的文件 Blob
const docxSrc = ref<Blob>()

// 文件信息
const fileInfo = reactive({
  name: '',
  size: 0
})

// 自定义上传处理：将文件转为 Blob 并触发预览
const handleUpload = (options: UploadRequestOptions): Promise<void> => {
  const file = options.file as File
  fileInfo.name = file.name
  fileInfo.size = file.size
  docxSrc.value = new Blob([file], { type: file.type })
  return Promise.resolve()
}

// 清除已上传文件
const clearFile = () => {
  docxSrc.value = undefined
  fileInfo.name = ''
  fileInfo.size = 0
}

// 格式化文件大小展示
const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
  return `${(size / 1024 / 1024).toFixed(2)} MB`
}
</script>

<style scoped lang="scss">
.docx-preview-page {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  // 渐变标题区
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 24px;
    background: linear-gradient(
      135deg,
      var(--el-color-primary-light-9),
      var(--el-color-info-light-9)
    );
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;

    h1 {
      margin: 0;
      font-size: 22px;
      color: var(--el-text-color-primary);
    }

    p {
      margin: 6px 0 0;
      color: var(--el-text-color-secondary);
    }
  }

  &__title-icon {
    display: inline-flex;
    width: 48px;
    height: 48px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: var(--global-layout-radius);
    background: linear-gradient(135deg, #409eff, #909399);
    color: #fff;
    box-shadow: 0 6px 16px var(--global-shadow-color);

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &__capabilities {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    flex: none;
  }

  // 上传区
  &__upload {
    padding: 8px;
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
    background: var(--el-bg-color-overlay);

    :deep(.el-upload-dragger) {
      border-color: var(--el-border-color);
      transition: border-color 0.25s ease;

      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }

  // 文件信息条
  &__info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border: 1px solid var(--el-color-primary-light-5);
    border-radius: var(--global-layout-radius);
    background: linear-gradient(
      135deg,
      var(--el-color-primary-light-9),
      var(--el-fill-color-light)
    );
  }

  &__info-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  &__info-icon {
    font-size: 20px;
    color: var(--el-color-primary);
    flex: none;
  }

  &__info-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__info-name {
    font-size: 14px;
    color: var(--el-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__info-size {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  // 预览区
  &__viewer {
    height: 700px;
    overflow: auto;
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
    background: var(--el-bg-color-overlay);
    box-shadow: 0 4px 16px var(--global-shadow-color);
  }

  &__empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--el-text-color-secondary);
  }

  &__empty-icon {
    font-size: 48px;
    color: var(--el-text-color-placeholder);
  }
}

// 响应式：760px 以下标题区纵向排列
@media (max-width: 760px) {
  .docx-preview-page__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .docx-preview-page__capabilities {
    justify-content: flex-start;
  }
}
</style>
