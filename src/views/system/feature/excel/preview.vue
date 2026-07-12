<template>
  <page-wrapper class="excel-preview-page">
    <!-- 渐变标题区 -->
    <header class="excel-preview-page__header">
      <div class="excel-preview-page__title">
        <div class="excel-preview-page__title-icon">
          <Files />
        </div>
        <div>
          <h1>Excel 在线预览</h1>
          <p>支持拖拽上传 xlsx、xls、csv 文件，在线渲染多 Sheet 表格内容。</p>
        </div>
      </div>
      <div class="excel-preview-page__capabilities">
        <el-tag effect="plain" type="primary">拖拽上传</el-tag>
        <el-tag effect="plain" type="success">多 Sheet</el-tag>
        <el-tag effect="plain" type="warning">表格渲染</el-tag>
      </div>
    </header>

    <!-- 拖拽上传区域 -->
    <section class="excel-preview-page__upload">
      <el-upload drag accept=".xlsx,.xls,.csv" :show-file-list="false" :http-request="handleUpload">
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="excel-preview-page__upload-tip">仅支持 .xlsx、.xls、.csv 格式文件</div>
        </template>
      </el-upload>
    </section>

    <!-- 当前文件信息条 -->
    <section v-if="currentFile" class="excel-preview-page__filebar">
      <div class="excel-preview-page__fileinfo">
        <el-icon class="excel-preview-page__fileicon"><Files /></el-icon>
        <span class="excel-preview-page__filename" :title="currentFile.name">{{
          currentFile.name
        }}</span>
        <el-tag size="small" type="info" effect="plain">{{ currentFile.size }}</el-tag>
      </div>
      <el-button text type="primary" @click="clearFile">清除</el-button>
    </section>

    <!-- 预览区域 -->
    <section class="excel-preview-page__preview">
      <xlsx-preview v-if="previewSrc" :file="previewSrc" />
      <div v-else class="excel-preview-page__empty">
        <el-icon class="excel-preview-page__empty-icon"><Files /></el-icon>
        <p>暂无预览文件，请先上传 Excel 文件</p>
      </div>
    </section>
  </page-wrapper>
</template>

<script setup lang="ts">
import { XlsxPreview } from '@/components/xlsx-preview'
import { PageWrapper } from '@/components'
import { Files, UploadFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
import type { UploadRequestOptions } from 'element-plus'

defineOptions({ name: 'ExcelPreviewPage' })

// 当前文件信息
const currentFile = ref<{ name: string; size: string; url: string } | null>(null)
// 预览组件所需的文件地址
const previewSrc = ref<string | undefined>(undefined)

// 格式化文件大小为可读字符串
function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B'
  const k = 1024
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`
}

// 自定义上传处理：生成临时链接并更新预览
const handleUpload = (options: UploadRequestOptions) => {
  const file = options.file
  // 释放上一次生成的临时链接，避免内存泄漏
  if (currentFile.value?.url) {
    URL.revokeObjectURL(currentFile.value.url)
  }
  const url = URL.createObjectURL(new Blob([file], { type: file.type }))
  currentFile.value = {
    name: file.name,
    size: formatFileSize(file.size),
    url
  }
  previewSrc.value = url
  return Promise.resolve({ url })
}

// 清除当前文件与预览
const clearFile = () => {
  if (currentFile.value?.url) {
    URL.revokeObjectURL(currentFile.value.url)
  }
  currentFile.value = null
  previewSrc.value = undefined
}
</script>

<style scoped lang="scss">
.excel-preview-page {
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
      var(--el-color-success-light-9)
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
    background: linear-gradient(135deg, #409eff, #67c23a);
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

  // 拖拽上传区域
  &__upload {
    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      width: 100%;
    }
  }

  &__upload-tip {
    margin-top: 8px;
    text-align: center;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  // 当前文件信息条
  &__filebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
    background: var(--el-bg-color-overlay);
  }

  &__fileinfo {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  &__fileicon {
    color: var(--el-color-primary);
    flex: none;
  }

  &__filename {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--el-text-color-primary);
  }

  // 预览区域
  &__preview {
    min-height: 400px;
    padding: 16px;
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
    background: var(--el-bg-color-overlay);
    box-shadow: 0 6px 16px var(--global-shadow-color);
  }

  // 空状态占位
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 400px;
    color: var(--el-text-color-secondary);

    p {
      margin: 0;
    }
  }

  &__empty-icon {
    font-size: 48px;
    color: var(--el-text-color-secondary);
  }
}

// 响应式：760px 以下标题区纵向排列
@media (max-width: 760px) {
  .excel-preview-page__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .excel-preview-page__capabilities {
    justify-content: flex-start;
  }
}
</style>
