<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <tinymce-editor></tinymce-editor>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { TinymceEditor, PageCard, PageWrapper } from '@/components'
</script>
