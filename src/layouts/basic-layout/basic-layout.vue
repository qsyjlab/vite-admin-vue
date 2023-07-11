<template>
  <Layout v-bind="layoutAttrs">
    <template #aside>
      <template v-if="isMobile">
        <div class="mobile-menu">
          <el-drawer v-model="mobileDrawer" direction="ltr" :with-header="false" size="70%">
            <basic-sidebar :collapsed="layoutConfig.collapsed">
              <template #logo v-if="LayoutMode.Side === layoutConfig.layoutMode">
                <logo v-bind="logoAttrs" />
              </template>
            </basic-sidebar>
          </el-drawer>
        </div>
      </template>

      <template
        v-if="
          !isMobile &&
          layoutConfig.layoutMode &&
          ![LayoutMode.Top, LayoutMode.SideMix].includes(layoutConfig.layoutMode)
        "
      >
        <basic-sidebar :collapsed="layoutConfig.collapsed">
          <template #logo v-if="LayoutMode.Side === layoutConfig.layoutMode">
            <logo v-bind="logoAttrs" />
          </template>
        </basic-sidebar>
      </template>

      <template
        v-if="
          !isMobile &&
          layoutConfig.layoutMode &&
          [LayoutMode.SideMix].includes(layoutConfig.layoutMode)
        "
      >
        <basic-mix-sidebar />
      </template>
    </template>

    <template #header>
      <basic-header @mobile-drawer="mobileDrawerHandler">
        <template #logo v-if="LayoutMode.TopMix === layoutConfig.layoutMode">
          <logo :width="layoutConfig.asideWidth" />
        </template>
      </basic-header>
    </template>

    <template #tabs>
      <basic-router-bar v-bind="routerBarAttrs" />
    </template>

    <div class="basic-layout-main__wrapper">
      <component :is="container"></component>
    </div>

    <template #footer>
      <basic-footer />
    </template>
  </Layout>

  <!-- 设置 -->
  <basic-setting />
</template>

<script setup lang="ts">
import './style.scss'
import { computed, unref, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store'

import { LayoutMode } from './enum'
import { Layout } from '@/layouts/layout-package'
import { createBlankContainer } from '@/layouts'

import {
  BasicHeader,
  BasicSidebar,
  BasicSetting,
  BasicRouterBar,
  BasicFooter,
  BasicMixSidebar
} from './components'

import { Logo, LogoProps } from './components/logo'

import type { BasicLayoutProps, LayoutModeMap, LogoModeMap } from './basic-layout'
import { useAppInject } from '@/application'

const container = createBlankContainer('BasicLayout')

const { layoutConfig, mixMenuLayoutConfig } = storeToRefs(useLayoutStore())

const { isMobile } = useAppInject()

const mobileDrawer = ref(false)

watch(
  isMobile,
  () => {
    mobileDrawer.value = isMobile.value
  },
  {
    immediate: true
  }
)

const mobileDrawerHandler = () => {
  mobileDrawer.value = !mobileDrawer.value
}

const routerBarAttrs = computed(() => {
  return {
    activeBgColor: 'var(--el-color-primary)',
    biddenRouter: ['WelcomeIndex']
  }
})

// layout props
const layoutAttrs = computed<BasicLayoutProps>(() => {
  const {
    layoutMode,
    asideWidth = 220,
    collapsed,
    headerHeight,
    tabBarHeight
  } = unref(layoutConfig)

  const { fixedMenu, showChildren } = unref(mixMenuLayoutConfig)
  const layoutModeMap: LayoutModeMap = {
    [LayoutMode.Side]: () => {
      const _asideWidth = isMobile.value ? 0 : collapsed ? 65 : asideWidth
      return {
        headerHeight,
        tabHeight: tabBarHeight,
        asideWidth: _asideWidth,
        headerPaddingLeft: _asideWidth,
        headerZIndex: 1001
      }
    },
    [LayoutMode.TopMix]: () => {
      const _asideWidth = isMobile.value ? 0 : collapsed ? 65 : asideWidth
      return {
        headerHeight,
        tabHeight: tabBarHeight,
        asideWidth: _asideWidth,
        asidePaddingTop: headerHeight,
        headerZIndex: 1003,
        headerPaddingLeft: 0
      }
    },
    [LayoutMode.Top]: () => ({
      tabHeight: tabBarHeight,
      asideWidth: 0,
      headerPaddingLeft: 0
    }),
    [LayoutMode.SideMix]: () => {
      const _asideWidth = isMobile.value ? 0 : fixedMenu && showChildren ? 75 + asideWidth : 75
      return {
        headerHeight,
        tabHeight: tabBarHeight,
        asideWidth: _asideWidth,
        headerPaddingLeft: _asideWidth
      }
    }
  }

  return layoutModeMap[layoutMode || LayoutMode.Side]()
})

const logoAttrs = computed<LogoProps>(() => {
  const { layoutMode, asideWidth, collapsed, headerHeight } = unref(layoutConfig)
  const logoModeMap: LogoModeMap = {
    [LayoutMode.Side]: () => {
      return {
        height: headerHeight,
        width: asideWidth,
        showTitle: !collapsed
      }
    },
    [LayoutMode.SideMix]: () => {
      return {}
    },
    [LayoutMode.TopMix]: () => {
      return {}
    },

    [LayoutMode.Top]: () => {
      return {}
    }
  }
  return logoModeMap[layoutMode || LayoutMode.Side]()
})
</script>

<style lang="scss" scoped>
.mobile-menu {
  :deep(.el-drawer__body) {
    padding: 0;
  }
}
</style>
