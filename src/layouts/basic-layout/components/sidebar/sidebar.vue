<template>
  <div class="layout-aside__wrapper">
    <slot name="logo"></slot>

    <aside-menu :collapsed="props.collapsed" :menu-list="menus"></aside-menu>
  </div>
</template>
<script setup lang="ts">
import { useRouteStore } from '@/store'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { AsideMenu } from './menu'

interface IProps {
  collapsed?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  collapsed: false
})
const routeStore = useRouteStore()

const router = useRouter()

const menus = computed(() => {
  const matched = router.currentRoute.value.matched[0]
  return (matched.name && routeStore.routeMapping[matched.name as string].menus) || []
})
</script>
