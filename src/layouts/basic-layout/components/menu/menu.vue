<template>
  <el-menu
    ref="menuRef"
    :collapse="collapsed"
    :default-active="currentActiveMenu"
    :collapse-transition="false"
    :popper-class="menuPopperClass"
    :mode="menuMode"
    router
  >
    <template v-for="menu in menus" :key="menu.name">
      <menu-item :item="menu" :mode="menuMode" />
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onBeforeUnmount, unref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store'
import MenuItem from './menu-item.vue'

import type { Menu } from '@/router/types'

interface IProps {
  collapsed?: boolean
  menus?: Menu[]
  menuType?: 'top' | 'side'
  isSplit?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  collapsed: false,
  menus: () => [],
  menuType: 'side',
  isSplit: false
})

const menuRef = ref()
const { currentRoute } = useRouter()
const { layoutConfig } = storeToRefs(useLayoutStore())

const menuPopperClass = computed(() => {
  const isLightApplication = layoutConfig.value.theme === 'light'
  const useDarkNavigation =
    (props.menuType === 'top' && layoutConfig.value.headerTheme === 'dark') ||
    (props.menuType === 'side' && layoutConfig.value.sidebarTheme === 'dark')

  return [
    'menu-popper-wrapper',
    isLightApplication && useDarkNavigation ? 'is-dark-navigation-menu' : ''
  ]
    .filter(Boolean)
    .join(' ')
})

const currentActiveMenu = computed(() => {
  const route = unref(currentRoute)

  if (props.isSplit && props.menuType === 'top') {
    return route.matched[0]?.name as string
  }

  return route.meta.currentActiveMenu || String(route.name)
})

const menuMode = computed(() => (props.menuType === 'top' ? 'horizontal' : 'vertical'))

// ========== 去掉弹出层菜单的外壳 ==========
let popperObserver: MutationObserver | null = null

function stripPopperShell() {
  // 找到所有带 menu-popper-wrapper class 的 popper，去除多余外壳样式
  document.querySelectorAll('.menu-popper-wrapper').forEach(el => {
    const popper = el.closest('.el-popper')
    if (popper) {
      popper.classList.add('is-menu-popup')
    }
  })

  // 也处理没有 popper-class 的情况：查找包含 .el-menu--popup 的 .el-popper
  document.querySelectorAll('.el-popper').forEach(popper => {
    if (popper.querySelector('.el-menu--popup') && !popper.classList.contains('is-menu-popup')) {
      popper.classList.add('is-menu-popup')
    }
  })
}

onMounted(() => {
  nextTick(() => {
    // 用 MutationObserver 动态监听弹出的 popper
    popperObserver = new MutationObserver(() => {
      stripPopperShell()
    })
    popperObserver.observe(document.body, { childList: true, subtree: true })
    // 立即执行一次
    stripPopperShell()
  })
})

onBeforeUnmount(() => {
  popperObserver?.disconnect()
})
</script>
