<template>
  <div class="basic-layout-header__wrapper">
    <div class="basic-layout-header__left">
      <slot name="logo">
        <logo v-if="layoutConfig.layoutMode === LayoutMode.Top" />
      </slot>
      <hover-card style="height: 100%" @click="toggleOperate">
        <el-icon><Operation /></el-icon>
      </hover-card>

      <template
        v-if="
          projectConfig.showBreadCrumb && !isMobile && layoutConfig.layoutMode !== LayoutMode.Top
        "
      >
        <Breadcrumb></Breadcrumb>
      </template>

      <div class="horizontal-menu" v-if="layoutConfig.layoutMode === LayoutMode.Top">
        <aside-menu :menus="getMenus()" mode="horizontal"></aside-menu>
      </div>
    </div>
    <div class="basic-layout-header__right">
      <user-menu></user-menu>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppInject } from '@/application'
import { useLayoutStore, usePermissionStore } from '@/store'
import { Operation } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { Breadcrumb, UserMenu } from './components'
import { AsideMenu } from '../menu'
import { Logo } from '../../components/logo'

import { LayoutMode } from '../../enum'

const emits = defineEmits<{
  'mobile-drawer': []
}>()

const layoutStore = useLayoutStore()

const { setLayoutConfig } = layoutStore

const toggleOperate = () => {
  if (isMobile.value) {
    emits('mobile-drawer')
  } else {
    setLayoutConfig({
      collapsed: !layoutConfig.value.collapsed
    })
  }
}

const { layoutConfig } = storeToRefs(useLayoutStore())
const { getMenus } = usePermissionStore()

const { isMobile, projectConfig } = useAppInject()
</script>
