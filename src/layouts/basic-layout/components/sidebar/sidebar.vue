<template>
  <div class="layout-aside_wapper">
    <!-- 菜单 -->
    <aside-menu :collapsed="props.collapsed" :menu-list="menuList"></aside-menu>
  </div>
</template>
<script setup lang="ts">
import { useRouteStore } from '@/store'
import { computed } from 'vue'
import { AsideMenu } from './menu'
interface IProps {
  collapsed?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  collapsed: false
})
const routeStore = useRouteStore()

const menuList = computed(() => routeStore.menuList)
</script>
