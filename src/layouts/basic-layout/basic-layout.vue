<template>
  <div class="page-container">
    <Layout
      v-bind="layoutAttrs"
      :config="{
        footer: projectSetting.defaultLayoutSetting.showFooter,
        header: true,
        tab: projectSetting.defaultLayoutSetting.showTagPage,
        aside: true,
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
    fontSize: !layoutConfig.value.tabBarHeight ? 14 : layoutConfig.value.tabBarHeight * 0.3
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

  const collapseWidth = 78

  const { fixedMenu, showChildren } = unref(mixMenuLayoutConfig)

  const { showTagPage } = projectSetting.defaultLayoutSetting
  const layoutModeMap: LayoutModeMap = {
    [LayoutMode.Side]: () => {
      const _asideWidth = isMobile.value ? 0 : collapsed ? collapseWidth : asideWidth
      return {
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
        headerHeight,
        tabHeight: showTagPage ? tabBarHeight : 0,
        asideWidth: _asideWidth,
        asidePaddingTop: headerHeight,
        headerZIndex: 1003,
        headerPaddingLeft: 0
      }
    },
    [LayoutMode.Top]: () => ({
      tabHeight: showTagPage ? tabBarHeight : 0,
      asideWidth: 0,
      headerPaddingLeft: 0
    }),
    [LayoutMode.SideMix]: () => {
      const _asideWidth = isMobile.value ? 0 : fixedMenu && showChildren ? 90 + asideWidth : 90
      return {
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
