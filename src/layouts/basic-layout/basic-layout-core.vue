<template>
  <div class="page-container">
    <Layout
      v-bind="layoutAttrs"
      :config="{
        footer: layoutConfig.showFooter,
        header: showHeader,
        tab: layoutConfig.showTagPage,
        aside: !!layoutAttrs.asideWidth,
        main: true
      }"
    >
      <template #aside>
        <template v-if="isMobile">
          <div class="mobile-menu">
            <el-drawer
              v-model="mobileDrawer"
              direction="ltr"
              :with-header="false"
              :size="layoutConfig.asideWidth || 250"
            >
              <basic-sidebar :collapsed="layoutConfig.collapsed">
                <template v-if="LayoutMode.Side === layoutConfig.layoutMode" #logo>
                  <logo v-bind="logoAttrs" />
                </template>
              </basic-sidebar>
            </el-drawer>
          </div>
        </template>

        <template v-else>
          <template
            v-if="
              layoutConfig.layoutMode &&
              ![LayoutMode.Top, LayoutMode.SideMix].includes(layoutConfig.layoutMode)
            "
          >
            <basic-sidebar :collapsed="layoutConfig.collapsed">
              <template v-if="LayoutMode.Side === layoutConfig.layoutMode" #logo>
                <logo v-bind="logoAttrs" />
              </template>
            </basic-sidebar>
          </template>

          <template
            v-if="layoutConfig.layoutMode && [LayoutMode.SideMix].includes(layoutConfig.layoutMode)"
          >
            <basic-mix-sidebar />
          </template>
        </template>
      </template>

      <template #header>
        <basic-header @mobile-drawer="mobileDrawerHandler">
          <template v-if="LayoutMode.TopMix === layoutConfig.layoutMode" #logo>
            <logo :width="layoutConfig.asideWidth" />
          </template>
        </basic-header>
      </template>

      <template #tabs>
        <basic-tab-page :font-size="12" />
      </template>

      <div
        v-watermark="{
          content: projectTitle
        }"
        class="basic-layout-main__wrapper"
      >
        <component :is="containerComponent"></component>
        <div id="react-swc"></div>
      </div>

      <template #footer>
        <basic-footer />
      </template>
    </Layout>
  </div>

  <el-backtop v-if="showBackTop" />

  <basic-setting v-if="showSettingButton" />
</template>

<script setup lang="ts">
import './style.scss'
import { computed, ref, watch } from 'vue'
import { LayoutMode } from './enum'
import { Layout } from '@/layouts/layout-package'
import {
  BasicHeader,
  BasicSidebar,
  BasicSetting,
  BasicTabPage,
  BasicFooter,
  BasicMixSidebar
} from './components'
import { Logo, type LogoProps } from './components/logo'

import type { BasicLayoutProps, LayoutModeMap, LogoModeMap } from './basic-layout'
import type { ProjectLayoutConfig } from './types'
import type { Component } from 'vue'

defineOptions({
  name: 'BasicLayoutCore'
})

const props = defineProps<{
  layoutConfig: ProjectLayoutConfig
  mixMenuLayoutConfig: {
    showChildren: boolean
  }
  containerComponent: Component
  isMobile: boolean
  projectTitle: string
  showBackTop: boolean
  showSettingButton: boolean
  showHeader: boolean
}>()

const mobileDrawer = ref(false)

watch(
  () => props.isMobile,
  () => {
    if (
      props.layoutConfig.layoutMode &&
      ![LayoutMode.Top].includes(props.layoutConfig.layoutMode)
    ) {
      mobileDrawer.value = props.isMobile
    }
  },
  {
    immediate: true
  }
)

const mobileDrawerHandler = () => {
  mobileDrawer.value = !mobileDrawer.value
}

const layoutAttrs = computed<BasicLayoutProps>(() => {
  const {
    layoutMode,
    asideWidth = 220,
    collapsed,
    headerHeight,
    tabBarHeight = 0,
    footerHeight
  } = props.layoutConfig

  const collapseWidth = 78
  const sideMixWidth = 90
  const { sideMixFixedMenu } = props.layoutConfig
  const { showTagPage } = props.layoutConfig

  const layoutModeMap: LayoutModeMap = {
    [LayoutMode.Side]: () => {
      const computedAsideWidth = props.isMobile ? 0 : collapsed ? collapseWidth : asideWidth
      return {
        footerHeight,
        headerHeight,
        tabHeight: showTagPage ? tabBarHeight : 0,
        asideWidth: computedAsideWidth,
        headerPaddingLeft: computedAsideWidth,
        headerZIndex: 1001
      }
    },
    [LayoutMode.TopMix]: () => {
      const computedAsideWidth = props.isMobile ? 0 : collapsed ? collapseWidth : asideWidth
      return {
        footerHeight,
        headerHeight,
        tabHeight: showTagPage ? tabBarHeight : 0,
        asideWidth: computedAsideWidth,
        asidePaddingTop: headerHeight,
        headerZIndex: 1003,
        headerPaddingLeft: 0
      }
    },
    [LayoutMode.Top]: () => ({
      footerHeight,
      tabHeight: showTagPage ? tabBarHeight : 0,
      asideWidth: 0,
      headerPaddingLeft: 0
    }),
    [LayoutMode.SideMix]: () => {
      const computedAsideWidth = props.isMobile
        ? 0
        : sideMixFixedMenu && props.mixMenuLayoutConfig.showChildren
          ? sideMixWidth + asideWidth
          : sideMixWidth
      return {
        footerHeight,
        headerHeight,
        tabHeight: showTagPage ? tabBarHeight : 0,
        asideWidth: computedAsideWidth,
        headerPaddingLeft: computedAsideWidth
      }
    }
  }

  return layoutModeMap[layoutMode || LayoutMode.Side]()
})

const logoAttrs = computed<LogoProps>(() => {
  const { layoutMode, asideWidth, collapsed, headerHeight } = props.layoutConfig
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
