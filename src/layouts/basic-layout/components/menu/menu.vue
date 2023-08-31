<template>
  <el-menu
    :collapse="collapsed"
    :default-active="currentActiveMenu"
    :collapse-transition="false"
    router
  >
    <template v-for="menu in menus" :key="menu.name">
      <menu-item :item="menu" />
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue'
import { useRouter } from 'vue-router'
import MenuItem from './menu-item.vue'

import { Menu } from '@/router/types'

interface IProps {
  collapsed?: boolean
  menus: Menu[]
}

withDefaults(defineProps<IProps>(), {
  collapsed: false,
  menus: () => []
})

const { currentRoute } = useRouter()

const currentActiveMenu = computed(() => {
  const route = unref(currentRoute)

  return route.meta.currentActiveMenu || String(route.name)
})
</script>
