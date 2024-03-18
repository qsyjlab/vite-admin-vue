<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <el-button type="primary" class="mb-20px" @click="exportHtmlToWord">导出 word</el-button>

      <pro-tinymce v-model="content"></pro-tinymce>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { pureRichTextExportDocx } from '@/utils'

const route = useRoute()

const content = ref('')

const exportHtmlToWord = () => {
  pureRichTextExportDocx(content.value, route.meta.title)
}
</script>
<style scoped></style>
