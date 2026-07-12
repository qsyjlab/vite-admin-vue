<template>
  <page-wrapper>
    <div class="pdf-preview-page">
      <!-- 渐变标题区 -->
      <div class="hero">
        <div class="hero__icon">
          <el-icon :size="36"><Document /></el-icon>
        </div>
        <div class="hero__content">
          <h2 class="hero__title">PDF 在线预览</h2>
          <p class="hero__desc">上传 PDF 文件即可在线预览，支持逐页浏览与缩放查看</p>
          <div class="hero__tags">
            <span class="tag">文件上传</span>
            <span class="tag">逐页渲染</span>
            <span class="tag">缩放</span>
          </div>
        </div>
      </div>

      <!-- 上传区域：拖拽上传 -->
      <div class="upload-section">
        <el-upload
          drag
          accept=".pdf"
          :show-file-list="false"
          :auto-upload="true"
          :http-request="handleUpload"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">将 PDF 文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">仅支持 PDF 格式文件</div>
          </template>
        </el-upload>
      </div>

      <!-- 文件信息条：有文件时展示 -->
      <div v-if="fileName" class="file-info">
        <el-icon class="file-info__icon"><Document /></el-icon>
        <span class="file-info__name" :title="fileName">{{ fileName }}</span>
        <span class="file-info__size">{{ formattedSize }}</span>
        <el-button text type="primary" size="small" @click="clearFile">移除</el-button>
      </div>

      <!-- 预览区域 -->
      <div class="preview-section">
        <pdf-preview v-if="src" :file="src" height="100%" />
        <div v-else class="preview-empty">
          <el-icon :size="48"><Document /></el-icon>
          <p>暂无预览文件，请先上传 PDF</p>
        </div>
      </div>
    </div>
  </page-wrapper>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Document, UploadFilled } from '@element-plus/icons-vue'
import type { UploadRequestOptions } from 'element-plus'
import { PageWrapper } from '@/components'
import { PdfPreview } from '@/components/pdf-preview'

defineOptions({ name: 'PdfPreviewPage' })

// 预览文件 Blob
const src = ref<Blob>()
// 当前文件名
const fileName = ref<string>('')
// 当前文件大小（字节）
const fileSize = ref<number>(0)

// 格式化文件大小展示
const formattedSize = computed(() => {
  const size = fileSize.value
  if (!size) return '0 B'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
})

// 自定义上传处理：不真正上传到服务器，仅读取文件用于预览
const handleUpload = (options: UploadRequestOptions) => {
  const file = options.file
  src.value = new Blob([file], { type: file.type })
  fileName.value = file.name
  fileSize.value = file.size
  return Promise.resolve(file)
}

// 移除当前文件
const clearFile = () => {
  src.value = undefined
  fileName.value = ''
  fileSize.value = 0
}
</script>

<style lang="scss" scoped>
.pdf-preview-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 渐变标题区 */
.hero {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--global-layout-radius);
  background: linear-gradient(
    135deg,
    var(--el-color-primary-light-9),
    var(--el-color-danger-light-9)
  );

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    color: var(--el-color-primary);
    background: var(--el-bg-color-overlay);
    box-shadow: 0 4px 12px var(--global-shadow-color);
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__title {
    margin: 0 0 6px;
    font-size: 20px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  &__desc {
    margin: 0 0 12px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

/* 能力标签 */
.tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  border-radius: 999px;
}

/* 上传区域：居中 */
.upload-section {
  display: flex;
  justify-content: center;

  :deep(.el-upload-dragger) {
    width: 100%;
    max-width: 560px;
    border-radius: var(--global-layout-radius);
  }
}

/* 文件信息条 */
.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--global-layout-radius);
  background: var(--el-bg-color-overlay);

  &__icon {
    flex-shrink: 0;
    color: var(--el-color-primary);
  }

  &__name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    color: var(--el-text-color-primary);
  }

  &__size {
    flex-shrink: 0;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

/* 预览区域 */
.preview-section {
  height: 700px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--global-layout-radius);
  overflow: hidden;
  background: var(--el-bg-color-overlay);
}

/* 预览空状态 */
.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
  color: var(--el-text-color-secondary);

  p {
    margin: 0;
    font-size: 14px;
  }
}

/* 响应式适配 */
@media (max-width: 767px) {
  .hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 18px;
  }

  .hero__icon {
    width: 56px;
    height: 56px;
  }

  .hero__title {
    font-size: 18px;
  }
}
</style>
