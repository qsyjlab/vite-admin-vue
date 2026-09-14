<template>
  <page-wrapper class="image-viewer-page">
    <g-page-header
      title="图片预览"
      description="点击缩略图打开 el-image 预览层，支持多图切换、缩放和旋转。"
      :icon="Picture"
    >
      <template #actions>
        <el-tag effect="plain" type="primary">多图切换</el-tag>
        <el-tag effect="plain" type="success">缩放旋转</el-tag>
      </template>
    </g-page-header>

    <pro-card>
      <div class="image-viewer-demo">
        <div class="image-list">
          <el-image
            v-for="image in images"
            :key="image.src"
            :src="image.src"
            :preview-src-list="images.map(item => item.src)"
            :initial-index="images.findIndex(item => item.src === image.src)"
            fit="contain"
            preview-teleported
          >
            <template #error>
              <div class="image-error"><ProIcon icon="ep.picture" :size="24" /></div>
            </template>
          </el-image>
        </div>
      </div>
    </pro-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { Picture } from '@element-plus/icons-vue'
import { GPageHeader, PageWrapper } from '@/components'
import { ProIcon } from '@/components/icon'
import Error403Image from '@/assets/svg/403.svg'
import Error404Image from '@/assets/svg/404.svg'
import EmptyImage from '@/assets/svg/empty.svg'

const images = [
  { src: '/logo.svg' },
  { src: Error403Image },
  { src: Error404Image },
  { src: EmptyImage }
]
</script>
<style lang="scss" scoped>
.image-viewer-page {
  gap: 16px;
}

.image-viewer-demo {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.image-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  :deep(.el-image) {
    width: 100%;
    height: 180px;
    padding: 12px;
    border: 1px solid var(--global-border-color);
    border-radius: 6px;
    background: var(--global-surface-color-muted);
    cursor: zoom-in;
  }
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--global-text-color-placeholder);
}

@media (max-width: 900px) {
  .image-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .image-list {
    grid-template-columns: 1fr;
  }
}
</style>
