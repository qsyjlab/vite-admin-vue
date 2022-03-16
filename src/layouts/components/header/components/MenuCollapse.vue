<!--
 * @Description: 折叠按钮
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-16 14:21:57
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 14:33:36
 * @FilePath: \vite-admin-vue\src\layouts\components\header\components\MenuCollapse.vue
-->
<template>
  <hover-card style="height: 100%" @click="folderMenu">
    <el-icon :size="20">
      <icon-expand></icon-expand>
    </el-icon>
  </hover-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const isCollapse = ref<boolean>(false)

const folderMenu = () => {
  isCollapse.value = !isCollapse.value
}
</script>
