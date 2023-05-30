<template>
  <div class="basic-layout-aside__wrapper">
    <slot name="logo"></slot>

    <el-scrollbar :max-height="sidebarHeight">
      <aside-menu :collapsed="props.collapsed" :menu-list="menus"></aside-menu>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { AsideMenu } from './menu'
import { getMenus } from '@/router/menus'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store'

interface IProps {
  collapsed?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  collapsed: false
})

const { layoutConfig } = storeToRefs(useLayoutStore())

const sidebarHeight = computed(() => {
  return `calc(100% - ${layoutConfig.value.headerHeight}px)`
})

const menus = computed(() => {
  // const matched = router.currentRoute.value.matched[0]
  return getMenus()
})
</script>
