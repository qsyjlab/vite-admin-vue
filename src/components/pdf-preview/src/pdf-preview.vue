<template>
  <div
    :style="{
      height
    }"
  >
    <el-scrollbar>
      <vue-office-pdf
        style="height: 100%"
        :src="file"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import VueOfficePdf from '@vue-office/pdf'

withDefaults(
  defineProps<{
    file?: any
    height?: string
  }>(),
  {
    height: '700px'
  }
)

function renderedHandler() {
  console.log('渲染完成')
}
function errorHandler() {
  console.log('渲染失败')
}
</script>
