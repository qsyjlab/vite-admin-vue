<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <pro-tinymce />
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { PageCard, PageWrapper } from '@/components'
import { ProTinymce } from '@/components/tinymce'
</script>
