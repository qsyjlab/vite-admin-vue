<template>
  <div
    class="docx-container"
    :style="{
      height
    }"
  >
    <el-scrollbar>
      <div ref="docxPreviewContainerRef" class="docx-preview"></div>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { docxPreviewRenderAsync } from '@/utils'
import { nextTick, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    file?: Blob | File | string
    height?: string
  }>(),
  {
    height: '100%'
  }
)

const docxPreviewContainerRef = ref<HTMLDivElement>()

watch(
  () => props.file,
  () => {
    nextTick(async () => {
      try {
        if (docxPreviewContainerRef.value && props.file) {
          docxPreviewRenderAsync(props.file, docxPreviewContainerRef.value)
        }
      } catch (error) {}
    })
  },
  {
    immediate: true
  }
)
</script>

<style scoped>
.docx-container {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  position: relative;
}

.docx-preview {
  overflow: auto; /* 确保内容超出边界时会显示滚动条 */
  width: 100%; /* 限制最大宽度，以免超出父元素 */
  height: 100%; /* 限制最大高度，以免超出*/
}
</style>
