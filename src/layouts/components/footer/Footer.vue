<!--
 * @Description: 页脚
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-21 22:55:04
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 14:34:50
 * @FilePath: \vite-admin-vue\src\layouts\components\footer\Footer.vue
-->

<template>
  <div class="footer">Copyright 2021 - {{ year }} by 青衫依旧</div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
<style scoped>
.footer {
  text-align: center;
  font-size: 14px;
}
</style>
