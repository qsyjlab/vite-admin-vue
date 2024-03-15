<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <input type="file" @change="fileChange" />

      <div style="height: 700px">
        <pdf-preview :file="src"></pdf-preview>
      </div>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { PdfPreview } from '@/components/pdf-preview'

const src = ref<Blob>()

const fileChange = (event: Event) => {
  if (event?.target) {
    const files = (event?.target as any).files as File[]

    if (files.length >= 1) {
      const file = files[0]
      src.value = new Blob([file], { type: file.type })
    }
  }
}
</script>
<style scoped></style>
