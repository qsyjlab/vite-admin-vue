<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 21:41:33
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 11:05:35
 * @FilePath: \vite-admin-vue\src\layouts\components\Menu\AsideMenu.vue
-->
<template>
  <el-menu default-active="2" class="el-menu-vertical-demo">
    <template v-for="menu in menuList" :key="menu.name">
      <aside-menu-item :menu-item="menu"></aside-menu-item>
    </template>
  </el-menu>
</template>
<script setup lang="ts">
import { MenuItem } from './menu'
import AsideMenuItem from './AsideMenuItem.vue'

interface AsideMenu {
  menuList: MenuItem[] | never[]
}

withDefaults(defineProps<AsideMenu>(), {
  menuList: () => []
})
</script>
