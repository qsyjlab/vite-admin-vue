<template>
  <div
    :class="[
      'basic-layout-header__wrapper',
      layoutConfig.layoutMode === LayoutMode.Top ? 'is-top-mode' : ''
    ]"
    :style="headerStyle"
  >
    <div
      :class="[
        'basic-layout-header__left',
        layoutConfig.layoutMode === LayoutMode.Top ? 'is-top-mode' : ''
      ]"
    >
      <el-tooltip v-if="isMobile" effect="dark" content="打开导航菜单" placement="bottom">
        <el-button
          class="mobile-menu-trigger"
          :icon="Menu"
          circle
          aria-label="打开导航菜单"
          @click="emit('mobile-drawer')"
        />
      </el-tooltip>

      <slot name="logo">
        <logo
          v-if="layoutConfig.layoutMode === LayoutMode.Top && !isMobile"
          :width="210"
          :height="layoutConfig.headerHeight"
          :logo-width="36"
        />
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
          !isMobile &&
          ([LayoutMode.Top].includes(layoutConfig.layoutMode) ||
            (LayoutMode.TopMix === layoutConfig.layoutMode && layoutConfig.splitMenu))
        "
        :class="[
          'horizontal-menu',
          layoutConfig.layoutMode === LayoutMode.Top ? 'is-top-mode' : ''
        ]"
      >
        <aside-menu
          :menus="getCurrentMenus"
          mode="horizontal"
          menu-type="top"
          :is-split="layoutConfig.splitMenu"
        ></aside-menu>
      </div>
    </div>
    <div
      :class="[
        'basic-layout-header__right',
        layoutConfig.layoutMode === LayoutMode.Top ? 'is-top-mode' : ''
      ]"
    >
      <el-space>
        <el-tooltip effect="dark" content="消息通知" placement="bottom">
          <notification>
            <el-button :icon="NotificationIcon" circle aria-label="消息通知"> </el-button>
          </notification>
        </el-tooltip>
        <el-tooltip effect="dark" :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
          <el-button
            :icon="FullScreen"
            circle
            :aria-label="isFullscreen ? '退出全屏' : '全屏'"
            @click="toggle"
          />
        </el-tooltip>
        <el-tooltip
          effect="dark"
          :content="layoutConfig.theme === 'light' ? '切换为暗黑模式' : '切换为亮色模式'"
          placement="bottom"
        >
          <el-button
            circle
            :aria-label="layoutConfig.theme === 'light' ? '切换为暗黑模式' : '切换为亮色模式'"
            @click="toggleTheme"
          >
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
          <el-button :icon="Setting" circle aria-label="页面配置" @click="toggleSettingDrawer" />
        </el-tooltip>

        <user-menu></user-menu>
      </el-space>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
  Setting,
  FullScreen,
  Menu,
  Notification as NotificationIcon
} from '@element-plus/icons-vue'
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
const emit = defineEmits<{
  (event: 'mobile-drawer'): void
}>()

const { toggleSettingDrawer } = layoutStore

const { isFullscreen, toggle } = useFullscreen()

const { setLayoutConfig, layoutConfig } = useLayoutConfigHandler()

const { isMobile, projectConfig } = useAppInject()
const headerStyle = computed(() => {
  const height = Math.max(0, Number(layoutConfig.value.headerHeight) || 0)
  const menuInset = Math.min(6, height * 0.12)

  return {
    '--layout-header-height': `${height}px`,
    '--layout-header-menu-height': `${Math.max(0, height - menuInset * 2)}px`,
    '--layout-header-menu-icon-size': `${Math.min(18, height * 0.45)}px`,
    '--layout-header-control-size': `${Math.min(32, height * 0.72)}px`,
    '--layout-header-user-height': `${Math.min(36, height * 0.82)}px`,
    '--layout-header-avatar-size': `${Math.min(32, height * 0.72)}px`
  }
})

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
