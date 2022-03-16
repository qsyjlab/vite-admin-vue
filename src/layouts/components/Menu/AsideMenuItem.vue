<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 21:53:45
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 11:46:59
 * @FilePath: \vite-admin-vue\src\layouts\components\Menu\AsideMenuItem.vue
-->
<template>
  <el-menu-item v-if="!menuItem.children?.length" :index="menuItem.name">
    <span>{{ menuItem.meta.title }}</span>
  </el-menu-item>
  <el-sub-menu v-else :index="menuItem.name">
    <template #title>
      <!-- <el-icon><location /></el-icon> -->

      <span>{{ menuItem.meta.title }}</span>
    </template>

    <template v-for="childMenu in menuItem.children" :key="childMenu.name">
      <el-menu-item v-if="!childMenu.children?.length" :index="childMenu.name">
        <template #title>
          {{ childMenu.meta.title }}
        </template>
      </el-menu-item>

      <aside-menu-item v-else :menu-item="childMenu"></aside-menu-item>
    </template>
  </el-sub-menu>
</template>
<script setup lang="ts">
import type { MenuItem } from './menu'

interface AsideMenuItemType {
  menuItem: MenuItem | never
}

withDefaults(defineProps<AsideMenuItemType>(), {})
</script>
