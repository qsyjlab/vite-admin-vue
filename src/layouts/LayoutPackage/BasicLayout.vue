<template>
  <layout-config-provider>
    <layout-container>
      <layout-aside v-bind="asideAttrs">
        <slot name="aside"> </slot>
      </layout-aside>

      <layout-header v-bind="headerAttrs">
        <slot name="header"></slot>
      </layout-header>

      <layout-tabs v-bind="tabAttrs">
        <slot name="tabs"> </slot>
      </layout-tabs>

      <layout-main v-bind="mainAttrs">
        <slot></slot>
      </layout-main>
      <layout-footer v-bind="footerAttrs">
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

interface Layout {
  asideWidth?: number
  headerHeight?: number
  tabHeight?: number
}

const props = withDefaults(defineProps<Layout>(), {
  asideWidth: 220,
  headerHeight: 48,
  tabHeight: 40
})

// 侧边栏属性
const asideAttrs = computed(() => {
  return {
    width: props.asideWidth
  }
})

// 头部属性
const headerAttrs = computed(() => {
  return {
    paddingLeft: props.asideWidth,
    height: props.headerHeight
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
const mainAttrs = computed(() => {
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
