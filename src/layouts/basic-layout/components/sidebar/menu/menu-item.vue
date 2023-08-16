<template>
  <el-menu-item
    v-if="!hasChildrenMenu(menuItem)"
    :index="menuItem.name"
    :route="{ name: menuItem.name }"
  >
    <component :is="menuItem?.meta?.icon" :size="14"></component>
    <template #title>
      <span>{{ menuItem?.meta?.title }}</span></template
    >
  </el-menu-item>

  <el-sub-menu v-else :index="menuItem.name">
    <template #title>
      <component :is="menuItem?.meta?.icon" :size="14"></component>
      <span>{{ menuItem?.meta?.title }}</span>
    </template>

    <template v-for="childMenu in menuItem.children" :key="childMenu.name">
      <el-menu-item
        v-if="!childMenu.children?.length"
        :index="childMenu.name"
        :route="{ name: childMenu.name }"
      >
        <component :is="childMenu?.meta?.icon" :size="14"></component>
        <template #title>
          {{ childMenu?.meta?.title }}
        </template>
      </el-menu-item>

      <menu-item v-else :menu-item="childMenu"></menu-item>
    </template>
  </el-sub-menu>
</template>

<script lang="ts">
export default {
  name: 'MenuItem'
}
</script>

<script setup lang="ts">
// import { MenuItem as MenuItemType } from '@/store'

interface IProps {
  menuItem: any
}

defineProps<IProps>()

const hasChildrenMenu = (item: any) => {
  return !item.meta?.hideChildrenInMenu && !!item.children?.length
}
</script>
