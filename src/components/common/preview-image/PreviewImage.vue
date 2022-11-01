<template>
  <el-dialog v-model="dialogVisible" title="预览" v-bind="$attrs" width="50%">
    <div class="image-viewer_wrapper">
      <img :src="options.src" alt="" />
    </div>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: 'QsPreviewImage'
}
</script>

<script setup lang="ts">
import { ref } from 'vue'

interface Options {
  src: string
}
const dialogVisible = ref(false)
const options = ref<Options>({ src: '' })

/**
 * ref
 */
const preview = (_options: Options) => {
  dialogVisible.value = !dialogVisible.value
  options.value = _options
}

defineExpose({
  preview
})
</script>
<style scoped>
.image-viewer_wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
}

.image-viewer_wrapper img {
  width: 100%;
  height: auto;
  object-fit: fill;
}
</style>
