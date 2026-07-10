<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <div class="image-viewer-demo">
        <div class="demo-copy">
          <h3>图片预览示例</h3>
          <p>点击缩略图打开预览，可切换图片、缩放和旋转。</p>
        </div>

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
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { PageWrapper } from '@/components/page-wrapper'
import { PageCard } from '@/components/page-card'
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
.image-viewer-demo {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.demo-copy {
  h3 {
    margin: 0 0 6px;
    color: var(--global-heading-color);
    font-size: 16px;
  }

  p {
    margin: 0;
    color: var(--global-text-color-secondary);
  }
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
