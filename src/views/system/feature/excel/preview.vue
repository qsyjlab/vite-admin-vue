<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <input type="file" @change="fileChange" />
      <xlsx-preview :file="src"></xlsx-preview>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { XlsxPreview } from '@/components/xlsx-preview'
import { xlsxFileReader } from '@/utils'
import { ref } from 'vue'

const mutipleSheetResult = ref<any[]>([])

const src = ref()

const fileChange = (event: Event) => {
  if (event?.target) {
    const files = (event?.target as any).files as File[]

    if (files.length >= 1) {
      const file = files[0]
      src.value = URL.createObjectURL(new Blob([file], { type: file.type }))

      console.log(' src.value', src.value)
    }
  }
}
</script>
<style scoped></style>
