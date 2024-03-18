<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <input type="file" @change="fileChange" />

      <div style="height: 700px">
        <docx-preview :file="docxSrc"></docx-preview>
      </div>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { DocxPreview } from '@/components/docx-preview'

const docxSrc = ref<Blob>()

const fileChange = (event: Event) => {
  if (event?.target) {
    const files = (event?.target as any).files as File[]

    if (files.length >= 1) {
      const file = files[0]
      docxSrc.value = new Blob([file], { type: file.type })
    }
  }
}
</script>
<style scoped></style>
