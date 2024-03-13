<template>
  <div class="basic-layout-header__wrapper">
    <div class="basic-layout-header__left">
      <slot name="logo">
        <logo v-if="layoutConfig.layoutMode === LayoutMode.Top" />
      </slot>

      <!-- 面包屑导航 -->
      <template
        v-if="
          layoutConfig.showBreadCrumb &&
          !isMobile &&
          [LayoutMode.Side, LayoutMode.SideMix].includes(layoutConfig.layoutMode)
        "
      >
        <Breadcrumb style="padding-left: 15px"></Breadcrumb>
      </template>

      <div
        v-if="
          [LayoutMode.Top].includes(layoutConfig.layoutMode) ||
          (LayoutMode.TopMix === layoutConfig.layoutMode && layoutConfig.splitMenu)
        "
        class="horizontal-menu"
      >
        <aside-menu
          :menus="getCurrentMenus"
          mode="horizontal"
          menu-type="top"
          :is-split="layoutConfig.splitMenu"
        ></aside-menu>
      </div>
    </div>
    <div class="basic-layout-header__right">
      <el-space>
        <el-tooltip effect="dark" content="消息通知" placement="bottom">
          <notification>
            <el-button :icon="NotificationIcon" circle> </el-button>
          </notification>
        </el-tooltip>
        <el-tooltip effect="dark" :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
          <el-button :icon="FullScreen" circle @click="toggle" />
        </el-tooltip>
        <el-tooltip
          effect="dark"
          :content="layoutConfig.theme === 'light' ? '切换为暗黑模式' : '切换为亮色模式'"
          placement="bottom"
        >
          <el-button circle @click="toggleTheme">
            <pro-icon v-if="layoutConfig.theme === 'light'" icon="svg.sun" :size="14" />
            <pro-icon v-else icon="svg.moon" :size="14" />
          </el-button>
        </el-tooltip>
        <el-tooltip
          v-if="projectConfig.defaultLayoutSetting.showSettingButton"
          effect="dark"
          content="页面配置"
          placement="bottom"
        >
          <el-button :icon="Setting" circle @click="toggleSettingDrawer" />
        </el-tooltip>

        <user-menu></user-menu>
      </el-space>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Setting, FullScreen, Notification as NotificationIcon } from '@element-plus/icons-vue'
import { useAppInject } from '@/application'
import { useLayoutStore } from '@/store'
import { Breadcrumb, UserMenu } from './components'
import { AsideMenu } from '../menu'
import { Logo } from '../../components/logo'
import { useFullscreen } from '@vueuse/core'
import { LayoutMode } from '../../enum'
import { isFullScreen as fullScreenStatus } from '@/utils'
import Notification from './components/notification.vue'
import { ProIcon } from '@/components'
import { useLayoutConfigHandler, useLayoutMenu } from '@/hooks'

const layoutStore = useLayoutStore()

const { toggleSettingDrawer } = layoutStore

const { isFullscreen, toggle } = useFullscreen()

const { setLayoutConfig, layoutConfig } = useLayoutConfigHandler()

const { isMobile, projectConfig } = useAppInject()
const { menus: getCurrentMenus } = useLayoutMenu(
  computed(() => {
    return {
      type: 'top'
    }
  })
)

onMounted(() => {
  isFullscreen.value = fullScreenStatus()
})

const toggleTheme = () => {
  setLayoutConfig('theme', layoutConfig.value.theme === 'light' ? 'dark' : 'light')
}
</script>
