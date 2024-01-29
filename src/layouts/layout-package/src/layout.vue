<template>
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  LayoutContainer,
  LayoutAside,
  LayoutHeader,
  LayoutFooter,
  LayoutMain,
  LayoutTabs
} from './components'

import type {
  LayoutSideBarProps,
  LayoutProps,
  LayoutMainProps,
  LayoutFooterProps
} from './interface'
import './style.scss'

type IProps = LayoutProps

const props = withDefaults(defineProps<IProps>(), {
  asideWidth: 220,
  asidePaddingTop: 0,
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
const asideAttrs = computed<LayoutSideBarProps>(() => {
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
  const top = props.config.header ? props.headerHeight : 0
  return {
    top,
    paddingLeft: props.asideWidth,
    height: props.tabHeight
  }
})

// 内容属性
const mainAttrs = computed<LayoutMainProps>(() => {
  let paddingTop = 0

  if (props.config.header) {
    paddingTop += props.headerHeight
  }
  if (props.config.tab) {
    paddingTop += props.tabHeight
  }

  return {
    paddingLeft: props.asideWidth,
    paddingTop: paddingTop
  }
})

const footerAttrs = computed<LayoutFooterProps>(() => {
  return {
    paddingLeft: props.asideWidth,
    height: props.footerHeight
  }
})
</script>
