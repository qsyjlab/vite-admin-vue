<template>
  <el-menu :collapse="collapsed" :default-active="$route.name?.toString()" router>
    <template v-for="menu in menuList" :key="menu.name">
      <menu-item :menu-item="menu" />
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import MenuItem from './menu-item.vue'

// TODO: 待优化类型
import { MenuItem as MenuItemType } from '@/store'

interface IProps {
  collapsed?: boolean
  menuList: MenuItemType[]
}

withDefaults(defineProps<IProps>(), {
  collapsed: false,
  menuList: () => []
})
</script>
