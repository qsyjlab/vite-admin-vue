<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-16 14:17:37
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 22:36:55
 * @FilePath: \vite-admin-vue\src\layouts\components\header\GlobalHeader.vue
-->
<template>
  <div class="layout-header_wapper">
    <div class="layout-header-left">
      <menu-collapse />
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="layout-header-right"></div>
  </div>
</template>
<script setup lang="ts">
// import MenuCollapse from './components/MenuCollapse.vue'
import { MenuCollapse, Breadcrumb } from './components'
</script>
<style scoped>
.layout-header_wapper {
  height: 100%;
  box-sizing: border-box;
  /* padding: 10px; */
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.layout-header-left,
.layout-header-right {
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
