<template>
  <div class="basic-layout-aside__wrapper">
    <slot name="logo"></slot>

    <el-scrollbar :max-height="sidebarHeight">
      <div class="basic-layout-aside__menus">
        <aside-menu :collapsed="props.collapsed" :menu-list="menus"></aside-menu>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { AsideMenu } from './menu'
import { storeToRefs } from 'pinia'
import { useLayoutStore, usePermissionStore } from '@/store'

interface IProps {
  collapsed?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  collapsed: false
})

const { getMenus } = usePermissionStore()
const { layoutConfig } = storeToRefs(useLayoutStore())

const sidebarHeight = computed(() => {
  return `calc(100% - ${layoutConfig.value.headerHeight}px)`
})

const menus = computed(() => {
  return getMenus()
})
</script>
