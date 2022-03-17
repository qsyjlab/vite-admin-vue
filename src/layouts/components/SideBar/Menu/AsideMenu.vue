<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 21:41:33
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-17 10:35:29
 * @FilePath: \vite-admin-vue\src\layouts\components\SideBar\Menu\AsideMenu.vue
-->
<template>
  <el-menu :collapse="layoutConfig.isCollapse" :collapse-transition="false" router>
    <template v-for="menu in menuList" :key="menu.name">
      <aside-menu-item :menu-item="menu"></aside-menu-item>
    </template>
  </el-menu>
</template>
<script setup lang="ts">
import { MenuItem } from './menu'
import AsideMenuItem from './AsideMenuItem.vue'
import { useStoreHelper } from '@/hooks'

interface AsideMenu {
  menuList: MenuItem[] | never[]
}

withDefaults(defineProps<AsideMenu>(), {
  menuList: () => []
})

const { useStateHelper } = useStoreHelper()
const { layoutConfig } = useStateHelper<VStoreRoot.app.appRootState>('app', ['layoutConfig'])
</script>
