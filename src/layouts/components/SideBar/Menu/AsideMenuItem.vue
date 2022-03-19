<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 21:53:45
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-19 23:31:59
 * @FilePath: \vite-admin-vue\src\layouts\components\SideBar\Menu\AsideMenuItem.vue
-->
<template>
  <el-menu-item
    v-if="!menuItem.children?.length"
    :index="menuItem.name"
    :route="{ name: menuItem.name }"
  >
    <span>{{ menuItem.meta.title }}</span>
  </el-menu-item>
  <el-sub-menu v-else :index="menuItem.name">
    <template #title>
      <span>{{ menuItem.meta.title }}</span>
    </template>

    <template v-for="childMenu in menuItem.children" :key="childMenu.name">
      <el-menu-item
        v-if="!childMenu.children?.length"
        :index="childMenu.name"
        :route="{ name: childMenu.name }"
      >
        <template #title>
          {{ childMenu.meta.title }}
        </template>
      </el-menu-item>

      <aside-menu-item v-else :menu-item="childMenu"></aside-menu-item>
    </template>
  </el-sub-menu>
</template>
<script setup lang="ts">
import type { MenuItem } from '@/types/store/moudles/route'

interface AsideMenuItemType {
  menuItem: MenuItem | never
}

withDefaults(defineProps<AsideMenuItemType>(), {})
</script>
