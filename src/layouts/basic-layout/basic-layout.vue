<template>
  <Layout v-bind="layoutAttrs">
    <template #aside>
      <template
        v-if="
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
        v-if="layoutConfig.layoutMode && [LayoutMode.SideMix].includes(layoutConfig.layoutMode)"
      >
        <basic-mix-sidebar />
      </template>
    </template>

    <template #header>
      <basic-header>
        <template #logo v-if="LayoutMode.TopMix === layoutConfig.layoutMode">
          <logo :width="layoutConfig.asideWidth" />
        </template>
      </basic-header>
    </template>

    <template #tabs>
      <basic-router-bar v-bind="routerBarAttrs" />
    </template>

    <div class="layout-main_wapper">
      <component :is="createBlankContainer('BasicLayout')"></component>
    </div>

    <template #footer>
      <div class="layout-footer_wapper">
        <basic-footer />
      </div>
    </template>
  </Layout>

  <!-- 设置 -->
  <basic-setting />
</template>

<script setup lang="ts">
import './style.scss'
import { computed, unref } from 'vue'
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

const { layoutConfig, mixMenuLayoutConfig } = storeToRefs(useLayoutStore())

const routerBarAttrs = computed(() => {
  return {
    activeBgColor: 'var(--el-color-primary)',
    biddenRouter: ['Welcome']
  }
})

// layout props
const layoutAttrs = computed<BasicLayoutProps>(() => {
  const { layoutMode, asideWidth = 220, collapsed, headerHeight } = unref(layoutConfig)

  const { fixedMenu, showChildren } = unref(mixMenuLayoutConfig)
  const layoutModeMap: LayoutModeMap = {
    [LayoutMode.Side]: () => {
      const _asideWidth = collapsed ? 65 : asideWidth
      return {
        headerHeight,
        asideWidth: _asideWidth,
        headerPaddingLeft: _asideWidth,
        headerZIndex: 1001
      }
    },
    [LayoutMode.TopMix]: () => {
      const _asideWidth = collapsed ? 65 : asideWidth
      return {
        headerHeight,
        asideWidth: _asideWidth,
        asidePaddingTop: headerHeight,
        headerZIndex: 1003,
        headerPaddingLeft: 0
      }
    },
    [LayoutMode.Top]: () => ({
      asideWidth: 0,
      headerPaddingLeft: 0
    }),
    [LayoutMode.SideMix]: () => {
      const _asideWidth = fixedMenu && showChildren ? 75 + asideWidth : 75
      return {
        headerHeight,
        asideWidth: _asideWidth,
        headerPaddingLeft: _asideWidth
      }
    }
  }

  return layoutModeMap[layoutMode || LayoutMode.Side]()
})

const logoAttrs = computed<LogoProps>(() => {
  const { layoutMode, asideWidth, collapsed } = unref(layoutConfig)
  const logoModeMap: LogoModeMap = {
    [LayoutMode.Side]: () => {
      return {
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
