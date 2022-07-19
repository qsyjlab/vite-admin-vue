<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 21:41:33
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-19 16:29:40
 * @FilePath: \vite-admin-vue\src\layouts\components\SideBar\Menu\AsideMenu.vue
-->
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
