<!--
 * @Description: 默认模板
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 14:59:32
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-27 21:07:04
 * @FilePath: \vite-admin-vue\src\layouts\BasicLayout\BasicLayout.vue
-->
<template>
  <BasicLayout v-bind="layoutAttrs">
    <template #aside>
      <div class="layout-aside_wapper">
        <aside-menu :menu-list="menuList"></aside-menu>
      </div>
    </template>

    <template #header>
      <global-header></global-header>
    </template>

    <template #tabs>
      <div class="layout-tabs-wapper">
        <global-router-bar v-bind="routerBarAttrs" />
      </div>
    </template>

    <div class="layout-main_wapper">
      <component :is="createBlankContainer('BasicLayout')"></component>
    </div>

    <template #footer>
      <div class="layout-footer_wapper">
        <global-footer></global-footer>
      </div>
    </template>
  </BasicLayout>

  <!-- 设置 -->
  <global-setting></global-setting>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStoreHelper } from '@/hooks'
import { useStore } from '@/store'
import { BasicLayout } from '@/layouts/LayoutPackage'
import { createBlankContainer } from '@/layouts'
import {
  AsideMenu,
  GlobalHeader,
  GlobalSetting,
  GlobalFooter,
  GlobalRouterBar
} from '../components'

const { useStateHelper } = useStoreHelper()
const { layoutConfig } = useStateHelper<VStoreRoot.App.AppStateHepler>('app', ['layoutConfig'])

const store = useStore()

const routerBarAttrs = computed(() => {
  return {
    activeBgColor: 'var(--el-color-primary)',
    biddenRouter: ['Welcome']
  }
})

// 获取菜单列表
const menuList = computed(() => store.state.route.menuList)

// layout props
const layoutAttrs = computed(() => {
  return {
    asideWidth: layoutConfig.value.isCollapse ? 65 : 220
  }
})
</script>

<style lang="scss" scoped>
.layout-aside_wapper {
  height: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.layout-main_wapper {
  box-sizing: border-box;
  height: 100%;
  background-color: rgba(246, 249, 248);
  padding: 15px;
}

.layout-tabs-wapper {
  height: 100%;
}
</style>
