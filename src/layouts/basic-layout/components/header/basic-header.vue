<template>
  <div class="layout-header_wapper">
    <div class="layout-header-left">
      <slot name="logo" />
      <menu-collapse />
      <Breadcrumb style="margin-left: 10px"></Breadcrumb>
    </div>
    <div class="layout-header-right">
      <user-menu style="margin-right: 10px"></user-menu>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MenuCollapse, Breadcrumb, UserMenu } from './components'
</script>
<style scoped>
.layout-header_wapper {
  height: 100%;
  box-sizing: border-box;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
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
