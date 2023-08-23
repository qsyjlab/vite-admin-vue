<template>
  <el-menu
    :collapse="collapsed"
    :default-active="currentActiveMenu"
    :collapse-transition="false"
    router
  >
    <template v-for="menu in menuList" :key="menu.name">
      <menu-item :menu-item="menu" />
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue'
import { useRouter } from 'vue-router'
import MenuItem from './menu-item.vue'

interface IProps {
  collapsed?: boolean
  menuList: any[]
}

withDefaults(defineProps<IProps>(), {
  collapsed: false,
  menuList: () => []
})

const { currentRoute } = useRouter()

const currentActiveMenu = computed(() => {
  const route = unref(currentRoute)

  return route.meta.currentActiveMenu || String(route.name)
})
</script>
