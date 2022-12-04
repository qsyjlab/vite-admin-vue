<template>
  <el-card>
    <template #header>
      {{ $route.meta.title }}
    </template>

    <qs-upload v-model="fileList"> </qs-upload>

    <qs-upload v-model="fileList" :limit="2" list-type="picture-card"> </qs-upload>
  </el-card>
</template>

<script lang="ts">
export default { name: 'Upload' }
</script>

<script setup lang="ts">
import { ref } from 'vue'
const fileList = ref([])
</script>
