<template>
  <div class="page-container">
    <Layout
      v-bind="layoutAttrs"
      :config="{
        footer: layoutConfig.showFooter,
        header: projectSetting.defaultLayoutSetting.showHeader,
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
        <basic-tab-page v-bind="routerBarAttrs" />
      </template>

      <div
        v-watermark="{
          content: config.projectTitle
        }"
        class="basic-layout-main__wrapper"
      >
        <component :is="container"></component>
        <div id="react-swc"></div>
      </div>

      <template #footer>
        <basic-footer />
      </template>
    </Layout>
  </div>

  <!-- 回到顶部 -->
  <el-backtop v-if="projectSetting.defaultLayoutSetting.showBackTop" />

  <!-- 设置 -->
  <basic-setting v-if="projectSetting.defaultLayoutSetting.showSettingButton" />
</template>

<script setup lang="ts">
import './style.scss'
import { computed, unref, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store'

import { LayoutMode } from './enum'
import { Layout } from '@/layouts/layout-package'
import createBlankContainer from '@/layouts/container/createBlankContainer'
import projectSetting from '@/config/project-setting'
import config from '@/config'

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
import { useAppInject } from '@/application'

const container = createBlankContainer('BasicLayout')

const { layoutConfig, mixMenuLayoutConfig } = storeToRefs(useLayoutStore())

const { isMobile } = useAppInject()

const mobileDrawer = ref(false)

watch(
  isMobile,
  () => {
    if (layoutConfig.value.layoutMode && ![LayoutMode.Top].includes(layoutConfig.value.layoutMode))
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
    fontSize: 12
  }
})

// layout props
const layoutAttrs = computed<BasicLayoutProps>(() => {
  const {
    layoutMode,
    asideWidth = 220,
    collapsed,
    headerHeight,
    tabBarHeight = 0,
    footerHeight
  } = unref(layoutConfig)

  const collapseWidth = 78
  const sideMixWidth = 90

  const { sideMixFixedMenu } = unref(layoutConfig)

  const { showTagPage } = layoutConfig.value
  const layoutModeMap: LayoutModeMap = {
    [LayoutMode.Side]: () => {
      const _asideWidth = isMobile.value ? 0 : collapsed ? collapseWidth : asideWidth
      return {
        footerHeight,
        headerHeight,
        tabHeight: showTagPage ? tabBarHeight : 0,
        asideWidth: _asideWidth,
        headerPaddingLeft: _asideWidth,
        headerZIndex: 1001
      }
    },
    [LayoutMode.TopMix]: () => {
      const _asideWidth = isMobile.value ? 0 : collapsed ? collapseWidth : asideWidth
      return {
        footerHeight,
        headerHeight,
        tabHeight: showTagPage ? tabBarHeight : 0,
        asideWidth: _asideWidth,
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
      const _asideWidth = isMobile.value
        ? 0
        : sideMixFixedMenu && mixMenuLayoutConfig.value.showChildren
          ? sideMixWidth + asideWidth
          : sideMixWidth
      return {
        footerHeight,
        headerHeight,
        tabHeight: showTagPage ? tabBarHeight : 0,
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
