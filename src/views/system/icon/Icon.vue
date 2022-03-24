<!--
 * @Description: 图标
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-23 21:42:01
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-24 16:30:38
 * @FilePath: \vite-admin-vue\src\views\system\icon\Icon.vue
-->

<template>
  <el-tabs v-model="activeName" type="border-card">
    <el-tab-pane label="@element-plus/icons-vue" :name="1">
      <element-plus-icon></element-plus-icon>
    </el-tab-pane>
    <el-tab-pane label="iconfont" :name="2">Config</el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import ElementPlusIcon from './components/ElementPlusIcon.vue'

const activeName = ref(1)
</script>
<style scoped></style>
