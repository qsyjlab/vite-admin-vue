<template>
  <Layout v-bind="layoutAttrs">
    <template #aside>
      <basic-sidebar :collapsed="layoutConfig.collapsed" />
    </template>

    <template #header>
      <basic-header />
    </template>

    <template #tabs>
      <global-router-bar v-bind="routerBarAttrs" />
    </template>

    <div class="layout-main_wapper">
      <component :is="createBlankContainer('BasicLayout')"></component>
    </div>

    <template #footer>
      <div class="layout-footer_wapper">
        <global-footer></global-footer>
      </div>
    </template>
  </Layout>

  <!-- 设置 -->
  <global-setting></global-setting>
</template>

<script setup lang="ts">
import './style.scss'
import { computed } from 'vue'
import { useLayoutStore } from '@/store'
import { Layout } from '@/layouts/layout-package'
import { createBlankContainer } from '@/layouts'
import {
  BasicHeader,
  BasicSidebar,
  GlobalSetting,
  GlobalFooter,
  GlobalRouterBar
} from './components'
import { storeToRefs } from 'pinia'

const { layoutConfig } = storeToRefs(useLayoutStore())

const routerBarAttrs = computed(() => {
  return {
    activeBgColor: 'var(--el-color-primary)',
    biddenRouter: ['Welcome']
  }
})

// layout props
const layoutAttrs = computed(() => {
  return {
    asideWidth: layoutConfig.value.collapsed ? 65 : 220
  }
})
</script>
