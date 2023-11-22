<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <tinymce-editor></tinymce-editor>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { PageCard, PageWrapper } from '@/components'
import { TinymceEditor } from '@/components/tinymce'
</script>
