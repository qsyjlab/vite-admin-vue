<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-16 13:12:38
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 14:30:41
 * @FilePath: \vite-admin-vue\src\components\common\HoverCard\HoverCard.vue
-->

<template>
  <div class="hover-card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'HoverCard'
}
</script>

<script setup lang="ts"></script>

<style scoped>
.hover-card {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 10px;
}
.hover-card:hover {
  cursor: pointer;
  background-color: #f1f2f6;
}
</style>
