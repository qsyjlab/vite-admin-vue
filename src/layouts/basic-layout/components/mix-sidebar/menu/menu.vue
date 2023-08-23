<template>
  <div class="basic-layout-mix-menu">
    <!---->
    <div
      class="basic-layout-mix-menu-module"
      :style="{
        width: 90 + 'px'
      }"
    >
      <div
        v-for="(item, index) in menus"
        :key="index"
        :class="['basic-layout-mix-menu-module__item', item.name === activeKey ? 'is-active' : '']"
        @click="clickMenuModuleHandler(item)"
      >
        <div
          :class="[
            item.name === activeKey ? 'is-active' : '',
            'basic-layout-mix-menu-module__icon'
          ]"
        >
          <el-icon :size="22">
            <MapLocation />
          </el-icon>
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

    <!-- 判定移出菜单蒙版 -->
    <div
      className="basic-layout-mix-menu__mask"
      :style="maskStyle"
      @mousemove="leaveChildrenMenuHandler"
    />
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
          <div
            class="basic-layout-mix-menu-children-header-icon"
            :style="{
              color: 'rgba(0, 0, 0, 0.35)'
            }"
            @click="onClickFixedEventHandler"
          >
            <Pushpin />
          </div>
        </div>

        <aside-menu :menuList="activeChildren" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, unref, watch, computed, CSSProperties, onUnmounted } from 'vue'
import { useLayoutStore, usePermissionStore } from '@/store'
// TODO: 待优化类型
import { MapLocation } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { AsideMenu } from '../../sidebar/menu'
import { routeChangeListener } from '@/router'

import Pushpin from '../pushpin.vue'
import { storeToRefs } from 'pinia'

interface IProps {
  menuWidth?: number
  headerHeight?: number
  routes?: any[]
}

defineProps<IProps>()

const layoutStore = useLayoutStore()

const { setMixMenuFixed, setMixMenuLayoutConfig } = layoutStore
const { mixMenuLayoutConfig } = storeToRefs(layoutStore)
const { getMenus } = usePermissionStore()
const route = useRoute()
const router = useRouter()

const activeKey = ref(route.name)

const showChildren = ref(false)
const activeChildren = ref<any[]>([])

const menus = computed(() => {
  return getMenus()
})

const stopRouteListener = routeChangeListener((to, from, matched) => {
  const moduleRoute = matched[0]
  activeKey.value = moduleRoute.name
  activeChildren.value = getActiveChildrenMenus()
})

onUnmounted(() => {
  stopRouteListener()
})

watch([showChildren], () => {
  setMixMenuLayoutConfig({
    showChildren: showChildren.value
  })
})

const maskStyle = computed<CSSProperties>(() => {
  const { fixedMenu, showChildren } = unref(mixMenuLayoutConfig)
  let display = 'block'

  if (!fixedMenu && showChildren) {
    display = 'block'
  } else {
    display = 'none'
  }

  return {
    display
  }
})

const clickMenuModuleHandler = (item: any) => {
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
const leaveChildrenMenuHandler = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()

  showChildren.value = false
}

const onClickFixedEventHandler = () => {
  setMixMenuFixed(!unref(mixMenuLayoutConfig).fixedMenu)
}
</script>

<style lang="scss" scoped>
@import '../mix-sidebar';
</style>
