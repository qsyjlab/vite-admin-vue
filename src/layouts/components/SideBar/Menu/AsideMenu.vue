<template>
  <el-menu :collapse="layoutConfig.isCollapse" :default-active="$route.name?.toString()" router>
    <template v-for="menu in menuList" :key="menu.name">
      <aside-menu-item :menu-item="menu"></aside-menu-item>
    </template>
  </el-menu>
</template>
<script setup lang="ts">
import AsideMenuItem from './AsideMenuItem.vue'
import { MenuItem, useAppStore } from '@/store'
import { storeToRefs } from 'pinia'

interface AsideMenu {
  menuList: MenuItem[]
}

withDefaults(defineProps<AsideMenu>(), {
  menuList: () => []
})

const appStore = useAppStore()

const { layoutConfig } = storeToRefs(appStore)
</script>
