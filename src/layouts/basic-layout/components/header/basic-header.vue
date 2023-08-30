<template>
  <div class="basic-layout-header__wrapper">
    <div class="basic-layout-header__left">
      <slot name="logo">
        <logo v-if="layoutConfig.layoutMode === LayoutMode.Top" />
      </slot>

      <!-- 面包屑导航 -->
      <template
        v-if="
          projectConfig.showBreadCrumb &&
          !isMobile &&
          [LayoutMode.Side, LayoutMode.SideMix].includes(layoutConfig.layoutMode)
        "
      >
        <Breadcrumb></Breadcrumb>
      </template>

      <div
        class="horizontal-menu"
        v-if="
          [LayoutMode.Top].includes(layoutConfig.layoutMode) ||
          (LayoutMode.TopMix === layoutConfig.layoutMode && layoutConfig.splitMenu)
        "
      >
        <aside-menu :menus="getCurrentMenus" mode="horizontal"></aside-menu>
      </div>
    </div>
    <div class="basic-layout-header__right">
      <user-menu></user-menu>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useAppInject } from '@/application'
import { useLayoutStore, usePermissionStore } from '@/store'
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

const getCurrentMenus = computed(() => {
  const menus = getMenus()

  if (layoutConfig.value.splitMenu && layoutConfig.value.layoutMode === LayoutMode.TopMix)
    return menus.map(i => ({ ...i, children: [] }))

  return menus
})
</script>
