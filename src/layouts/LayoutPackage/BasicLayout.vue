<!--
 * @Description: 布局
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 11:04:26
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 16:58:49
 * @FilePath: \vite-admin-vue\src\layouts\LayoutPackage\BasicLayout.vue
-->

<template>
  <layout-config-provider>
    <layout-container>
      <layout-aside v-bind="asideAttrs">
        <slot name="aside"> </slot>
      </layout-aside>
      <layout-container direction="vertical">
        <layout-header v-bind="headerAttrs">
          <slot name="header"></slot>
        </layout-header>
        <layout-main v-bind="mainAttrs">
          <slot></slot>
        </layout-main>
        <layout-footer v-bind="footerAttrs">
          <slot name="footer"></slot>
        </layout-footer>
      </layout-container>
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
  LayoutMain
} from './components'

interface Layout {
  asideWidth?: number
  headerHeight?: number
}

const props = withDefaults(defineProps<Layout>(), {
  asideWidth: 220,
  headerHeight: 56
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

// 内容属性
const mainAttrs = computed(() => {
  return {
    paddingLeft: props.asideWidth,
    paddingTop: props.headerHeight
  }
})

const footerAttrs = computed(() => {
  return {
    paddingLeft: props.asideWidth
  }
})
</script>
