<template>
  <div class="basic-layout-header__wrapper">
    <div class="basic-layout-header__left">
      <slot name="logo" />
      <menu-collapse v-if="!isMobile" />

      <hover-card v-else style="height: 100%" @click="$emit('mobile-drawer')">
        <el-icon><Operation /></el-icon>
      </hover-card>

      <Breadcrumb v-if="!isMobile" style="margin-left: 10px"></Breadcrumb>
    </div>
    <div class="basic-layout-header__right">
      <user-menu style="margin-right: 10px"></user-menu>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppInject } from '@/application'
import { Operation } from '@element-plus/icons-vue'

import { MenuCollapse, Breadcrumb, UserMenu } from './components'

const { isMobile } = useAppInject()
</script>
