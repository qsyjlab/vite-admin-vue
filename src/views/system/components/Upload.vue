<template>
  <page-wrapper>
    <page-card>
      <template #header>
        {{ $route.meta.title }}
      </template>
      <upload>
        <el-button>上传</el-button>
      </upload>

      <!-- <qs-upload v-model="fileList"> </qs-upload>

    <qs-upload v-model="fileList" :limit="2" list-type="picture-card"> </qs-upload> -->
    </page-card>
  </page-wrapper>
</template>

<script lang="ts">
export default { name: 'Upload' }
</script>

<script setup lang="ts">
import { PageWrapper } from '@/components/page-wrapper'
import { PageCard } from '@/components/page-card'
import { Upload } from '@/components/upload'

import { ref } from 'vue'
const fileList = ref([])
</script>
