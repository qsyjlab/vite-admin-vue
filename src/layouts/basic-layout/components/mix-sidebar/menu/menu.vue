<template>
  <div
    :class="['basic-layout-mix-menu', layoutConfig.sideMixFixedMenu ? 'is-fixed' : '']"
    :tabindex="-1"
    @blur="leaveChildrenMenuHandler"
  >
    <!---->
    <div class="basic-layout-mix-menu-module">
      <div
        v-for="(item, index) in menus"
        :key="index"
        :class="['basic-layout-mix-menu-module__item', item.name === activeKey ? 'is-active' : '']"
        @click="clickMenuModuleHandler(item)"
      >
        <div
          :class="[
            item.name === activeKey ? 'is-active' : '',
            'basic-layout-mix-menu-module__icon',
            !item.meta?.icon ? 'no-icon' : ''
          ]"
        >
          <pro-icon v-if="item.meta?.icon" :icon="item.meta?.icon" :size="20"></pro-icon>
          <span v-else class="fallback-text">{{ (item.meta?.title || '').charAt(0) }}</span>
        </div>
        <div
          :class="[
            item.name === activeKey ? 'is-active' : '',
            'basic-layout-mix-menu-module__label'
          ]"
        >
          {{ item.meta?.title }}
        </div>
        <div v-show="item.name === activeKey" class="basic-layout-mix-menu-module__line" />
      </div>
    </div>

    <div
      :class="['basic-layout-mix-menu-children', showChildren ? 'is-show' : '']"
      :style="{
        width: showChildren ? `${menuWidth}px` : '0px'
      }"
    >
      <div class="basic-layout-mix-menu-children__content">
        <div
          class="basic-layout-mix-menu-children-header"
          :style="{
            height: headerHeight + 'px'
          }"
        >
          <button
            type="button"
            class="basic-layout-mix-menu-children-header-icon"
            :aria-label="layoutConfig.sideMixFixedMenu ? '取消固定子菜单' : '固定子菜单'"
            :title="layoutConfig.sideMixFixedMenu ? '取消固定子菜单' : '固定子菜单'"
            @mousedown.prevent.stop
            @click.stop="onClickFixedEventHandler"
          >
            <Pushpin />
          </button>
        </div>

        <aside-menu :menus="activeChildren" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue'
import { useLayoutStore, usePermissionStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { AsideMenu } from '../../menu'
import { routeChangeListener } from '@/router'
import { ProIcon } from '@/components/icon'

import Pushpin from '../pushpin.vue'
import { storeToRefs } from 'pinia'
import type { Menu } from '@/router/types'

interface IProps {
  menuWidth?: number
  headerHeight?: number
}

defineProps<IProps>()

const layoutStore = useLayoutStore()

const { layoutConfig } = storeToRefs(layoutStore)
const { getMenus } = usePermissionStore()

const route = useRoute()
const router = useRouter()

const activeKey = ref(route.name)

const showChildren = ref(false)
const activeChildren = ref<Menu[]>([])

const menus = computed(() => {
  return getMenus()
})

const stopRouteListener = routeChangeListener((_to, _from, matched) => {
  const moduleRoute = matched[0]
  activeKey.value = moduleRoute.name
  activeChildren.value = getActiveChildrenMenus()

  if (activeChildren.value.length === 0) {
    showChildren.value = false
  }
})

onUnmounted(() => {
  stopRouteListener()
})

watch(showChildren, newVal => {
  layoutStore.setShowMixChildrenMenu(newVal)
})

const clickMenuModuleHandler = (item: Menu) => {
  if (!item.name) return

  showChildren.value = false

  activeKey.value = item.name

  activeChildren.value = getActiveChildrenMenus()
  // 无下级则直接跳转路由
  if (activeChildren.value.length === 0) {
    showChildren.value = false
    router.push({ name: item.name, query: {} })

    return
  }

  showChildren.value = true
}

function getActiveChildrenMenus() {
  const activeMainRoute = menus.value.find(i => i.name === activeKey.value)

  if (!activeMainRoute) return []
  const { children = [], meta } = activeMainRoute
  return meta?.hideChildrenInMenu && children?.length && children?.length <= 1 ? [] : children
}

//  鼠标移除 子菜单处理
const leaveChildrenMenuHandler = () => {
  if (layoutConfig.value.sideMixFixedMenu && showChildren.value) return
  showChildren.value = false
}

const onClickFixedEventHandler = () => {
  const nextFixed = !layoutStore.layoutConfig.sideMixFixedMenu

  if (nextFixed) {
    showChildren.value = true
    layoutStore.setShowMixChildrenMenu(true)
  }

  layoutStore.setLayoutConfig({
    sideMixFixedMenu: nextFixed
  })
}
</script>

<style lang="scss" scoped>
@use '../mix-sidebar';
</style>
