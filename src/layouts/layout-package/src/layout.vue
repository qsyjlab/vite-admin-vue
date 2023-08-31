<template>
  <layout-config-provider>
    <layout-container>
      <layout-aside v-if="config.aside" v-bind="asideAttrs">
        <slot name="aside"> </slot>
      </layout-aside>

      <layout-header v-if="config.header" v-bind="headerAttrs">
        <slot name="header"></slot>
      </layout-header>

      <layout-tabs v-if="config.tab" v-bind="tabAttrs">
        <slot name="tabs"> </slot>
      </layout-tabs>

      <layout-main v-if="config.main" v-bind="mainAttrs">
        <slot></slot>
      </layout-main>
      <layout-footer v-if="config.footer" v-bind="footerAttrs">
        <slot name="footer"></slot>
      </layout-footer>
    </layout-container>
  </layout-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  LayoutConfigProvider,
  LayoutContainer,
  LayoutAside,
  LayoutHeader,
  LayoutFooter,
  LayoutMain,
  LayoutTabs
} from './components'

import type { LayoutProps, AsideProps, MainProps } from './types'
import './style.scss'

interface Layout {
  asideWidth?: LayoutProps['asideWidth']
  asideHeight?: LayoutProps['asideHeight']
  asideTop?: LayoutProps['asideTop']
  asidePaddingTop?: LayoutProps['asidePaddingTop']
  headerHeight?: LayoutProps['headerHeight']
  headerPaddingLeft?: LayoutProps['headerPaddingLeft']
  headerZIndex?: LayoutProps['headerZIndex']
  tabHeight?: LayoutProps['tabHeight']
  config?: {
    header: boolean
    tab: boolean
    aside: boolean
    footer: boolean
    main: boolean
  }
}

const props = withDefaults(defineProps<Layout>(), {
  asideWidth: 220,
  asidePaddingTop: 0,
  asideTop: 0,
  headerHeight: 48,
  tabHeight: 32,
  headerZIndex: 1001,
  mainPaddingLeft: 220,
  config: () => ({
    header: true,
    tab: true,
    aside: true,
    main: true,
    footer: true
  })
})

// 侧边栏属性
const asideAttrs = computed<AsideProps>(() => {
  return {
    width: props.asideWidth,
    paddingTop: props.asidePaddingTop
  }
})

// 头部属性
const headerAttrs = computed(() => {
  return {
    paddingLeft: props.headerPaddingLeft,
    height: props.headerHeight,
    zIndex: props.headerZIndex
  }
})

// tab 属性
const tabAttrs = computed(() => {
  return {
    top: props.headerHeight,
    paddingLeft: props.asideWidth,
    height: props.tabHeight
  }
})

// 内容属性
const mainAttrs = computed<MainProps>(() => {
  return {
    paddingLeft: props.asideWidth,
    paddingTop: props.headerHeight + props.tabHeight
  }
})

const footerAttrs = computed(() => {
  return {
    paddingLeft: props.asideWidth
  }
})
</script>
