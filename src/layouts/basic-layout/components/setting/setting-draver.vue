<template>
  <div class="setting-container">
    <div class="setting-bottom">
      <div
        class="setting-buttom-class"
        :style="{ backgroundColor: layoutConfig.themeColor }"
        @click="toggleSettingDrawer"
      >
        <el-icon v-if="!isOpenSettig">
          <icon-setting />
        </el-icon>
        <el-icon v-else>
          <icon-close />
        </el-icon>
      </div>
    </div>

    <el-drawer :with-header="false" v-model="isOpenSettig" direction="rtl" size="370px">
      <!-- {{ layoutConfig }} -->
      <div class="setting-body">
        <div class="setting-title">系统布局配置</div>

        <div class="setting-item">
          <div class="setting-item__label">整体风格</div>
          <div class="setting-item__content">
            <el-switch
              v-model="layoutConfig.theme"
              active-value="light"
              inactive-value="dark"
              @change="(value:any) => setLayoutConfig(LayoutConfigHandlerEnum.LAYOUT_THEME, value)"
            />
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-item__label">主题色</div>
          <div class="setting-item__content">
            <el-color-picker
              v-model="layoutConfig.themeColor"
              @change="(value:any) => setLayoutConfig(LayoutConfigHandlerEnum.THEME_COLOR, value)"
            />
          </div>
        </div>

        <div class="setting-item is-vertical">
          <div class="setting-item__label">导航模式</div>
          <div class="setting-item__content">
            <CheckButtonGroup
              :default-value="layoutConfig.layoutMode"
              :options="layoutModeOptions"
              @change="value => setLayoutConfig(LayoutConfigHandlerEnum.LAYOUT_MODE, value)"
            />
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-item__label">折叠菜单</div>
          <div class="setting-item__content">
            <el-switch
              v-model="layoutConfig.collapsed"
              @change="(value:any) =>  setLayoutConfig(LayoutConfigHandlerEnum.COLLAPSED, value)"
            />
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-item__label">菜单展开宽度</div>
          <div class="setting-item__content">
            <el-input-number
              v-model="layoutConfig.asideWidth"
              @change=" (value:any) => setLayoutConfig(LayoutConfigHandlerEnum.MENU_WIDTH, value)"
            />
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-item__label">头部高度</div>
          <div class="setting-item__content">
            <el-input-number
              v-model="layoutConfig.headerHeight"
              @change=" (value:any) => setLayoutConfig(LayoutConfigHandlerEnum.HEADER_HEIGHT, value)"
            />
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-item__label">tab bar高度</div>
          <div class="setting-item__content">
            <el-input-number
              v-model="layoutConfig.tabBarHeight"
              @change=" (value:any) => setLayoutConfig(LayoutConfigHandlerEnum.TAB_BAR_HEIGHT, value)"
            />
          </div>
        </div>

        <el-button @click="$router.push({ name: 'Home' })">主系统</el-button>
        <el-button @click="$router.push({ name: 'icon1' })">分支系统</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/store'
import { storeToRefs } from 'pinia'
import { LayoutMode } from '../../enum'
import CheckButtonGroup from './check-button-group.vue'
import { LeftSideMix, NavTop, SideTopMix, LeftSide } from './icon'

import { useLayoutConfigHandler, LayoutConfigHandlerEnum } from '@/hooks'

const layoutStore = useLayoutStore()
const { layoutConfig, setLayoutConfig } = useLayoutConfigHandler()
const { isOpenSettig } = storeToRefs(layoutStore)

const { toggleSettingDrawer } = layoutStore

// 导航模式选项
const layoutModeOptions = [
  {
    title: '侧边栏布局',
    value: LayoutMode.Side,
    icon: LeftSide
  },
  {
    title: '顶部菜单布局',
    value: LayoutMode.Top,
    icon: NavTop
  },
  {
    title: '顶部混合菜单',
    value: LayoutMode.TopMix,
    icon: SideTopMix
  },
  {
    title: '左侧菜单混合',
    value: LayoutMode.SideMix,
    icon: LeftSideMix
  }
]
</script>

<style lang="scss" scoped>
.setting-container {
  position: fixed;
  z-index: 1004;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: white;

  /* background: rgba(0, 0, 0, 0.2); */
}

.mask-container {
  position: fixed;
  z-index: 1003;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgb(0 0 0 / 20%);
}

.setting-body {
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  box-sizing: border-box;
}

.setting-bottom {
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
}

.setting-buttom-class {
  width: 48px;
  height: 48px;
  position: absolute;
  left: -48px;
  text-align: center;
  font-size: 24px;
  border-radius: 6px 0 0 6px !important;
  z-index: 0;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: 0;
}

.setting-title {
  font-weight: bold;
  margin-bottom: 20px;
}

.setting-item {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  &.is-vertical {
    display: block;

    .setting-item__label {
      margin-bottom: 15px;
    }
  }
}
</style>
