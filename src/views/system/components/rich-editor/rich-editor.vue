<template>
  <el-card>
    <template #header>{{ $route.meta.title }}</template>
    <!-- <TinymceVueEditor v-model="content" /> -->
    <VTinymceEditor />
  </el-card>
</template>
<script setup lang="ts">
// // import TinymceVueEditor from '@/components/tinymce/src/editor.vue'
// import { ref } from 'vue'

// const content = ref<string>('123123')

// setTimeout(() => {
//   content.value = '测试数值'
// }, 2000)
</script>
