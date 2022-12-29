<template>
  <div class="basic-layout-header__wrapper">
    <div class="basic-layout-header__left">
      <slot name="logo" />
      <menu-collapse />
      <Breadcrumb style="margin-left: 10px"></Breadcrumb>
    </div>
    <div class="basic-layout-header__right">
      <user-menu style="margin-right: 10px"></user-menu>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MenuCollapse, Breadcrumb, UserMenu } from './components'
</script>
