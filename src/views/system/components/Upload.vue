<!--
 * @Description:
 * @Version:
 * @Autor: qsyj
 * @Date: 2022-03-28 15:25:03
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-28 22:52:19
-->

<template>
  <el-card>
    <template #header>
      {{ $route.meta.title }}
    </template>

    <qs-upload v-model="fileList"> </qs-upload>

    <qs-upload v-model="fileList" :limit="2" list-type="picture-card"> </qs-upload>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const fileList = ref([])

const fileChange = fileList => {
  // console.log('fileList', fileList)
}
</script>
<style scoped></style>
