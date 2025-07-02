<template>
  <el-drawer :model-value="isOpenSettig" :with-header="false" direction="rtl" size="370px">
    <div class="setting">
      <div class="setting-title">系统布局配置</div>
      <div class="setting-body">
        <div class="setting-item">
          <div class="setting-item__label">主题色</div>
          <div class="setting-item__content">
            <el-color-picker
              :model-value="layoutConfig.themeColor"
              @change="(value: any) => setLayoutConfig(LayoutConfigHandlerEnum.THEME_COLOR, value)"
            />
          </div>
        </div>

        <div class="setting-item is-vertical">
          <div class="setting-item__label">导航模式</div>
          <div class="setting-item__content">
            <CheckButtonGroup
              :model-value="layoutConfig.layoutMode"
              :options="layoutModeOptions"
              @change="(value: any) => setLayoutConfig(LayoutConfigHandlerEnum.LAYOUT_MODE, value)"
            />
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-item__label">折叠菜单</div>
          <div class="setting-item__content">
            <el-switch
              :model-value="layoutConfig.collapsed"
              @change="(value: any) => setLayoutConfig(LayoutConfigHandlerEnum.COLLAPSED, value)"
            />
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-item__label">是否分割菜单</div>
          <div class="setting-item__content">
            <el-switch
              :model-value="layoutConfig.splitMenu"
              :disabled="LayoutMode.TopMix !== layoutConfig.layoutMode"
              @change="(value: any) => setLayoutConfig(LayoutConfigHandlerEnum.SPLIT_MENU, value)"
            />
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-item__label">菜单展开宽度</div>
          <div class="setting-item__content">
            <el-input-number
              :model-value="layoutConfig.asideWidth"
              @change="(value: any) => setLayoutConfig(LayoutConfigHandlerEnum.MENU_WIDTH, value)"
            />
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-item__label">头部高度</div>
          <div class="setting-item__content">
            <el-input-number
              :model-value="layoutConfig.headerHeight"
              @change="
                (value: any) => setLayoutConfig(LayoutConfigHandlerEnum.HEADER_HEIGHT, value)
              "
            />
          </div>
        </div>
        <div class="setting-item">
          <div class="setting-item__label">显示面包屑导航</div>
          <div class="setting-item__content">
            <el-switch
              :model-value="layoutConfig.showBreadCrumb"
              @change="
                (value: any) => setLayoutConfig(LayoutConfigHandlerEnum.SHOW_BREAD_CRUMB, value)
              "
            />
          </div>
        </div>

        <setting-item title="标签页显示">
          <el-switch
            :model-value="layoutConfig.showTagPage"
            @change="(value: any) => setLayoutConfig(LayoutConfigHandlerEnum.SHOW_TAB_PAGE, value)"
          />
        </setting-item>
        <setting-item title="显示页脚">
          <el-switch
            :model-value="layoutConfig.showFooter"
            @change="(value: any) => setLayoutConfig(LayoutConfigHandlerEnum.SHOW_FOOTER, value)"
          />
        </setting-item>
        <div class="setting-item">
          <div class="setting-item__label">标签页高度</div>
          <div class="setting-item__content">
            <el-input-number
              :model-value="layoutConfig.tabBarHeight"
              @change="
                (value: any) => setLayoutConfig(LayoutConfigHandlerEnum.TAB_BAR_HEIGHT, value)
              "
            />
          </div>
        </div>
      </div>
      <div class="setting-footer">
        <el-space style="width: 100%" fill direction="vertical">
          <el-button :icon="CopyDocument" type="primary" @click="copyJsonConfig">复制</el-button>
          <el-button :icon="Refresh" type="warning" @click="resertConfig">重置</el-button>
        </el-space>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { CopyDocument, Refresh } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/store'
import { useLayoutConfigHandler, LayoutConfigHandlerEnum, useMessage } from '@/hooks'
import { copyToClipboard } from '@/utils'

import { LayoutMode } from '../../enum'
import CheckButtonGroup from './check-button-group.vue'
import SettingItem from './setting-item.vue'
import { LeftSideMix, NavTop, SideTopMix, LeftSide } from './icon'

const { message, messageBox } = useMessage()
const layoutStore = useLayoutStore()
const { layoutConfig, setLayoutConfig, getProjectSetting, resetLayoutConfig } =
  useLayoutConfigHandler()
const { isOpenSettig } = storeToRefs(layoutStore)

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

const copyJsonConfig = () => {
  copyToClipboard(JSON.stringify(getProjectSetting(), null, 2), {
    success: () => {
      messageBox.confirm('复制成功,请到 src/config/project-setting.ts 中修改配置！', '复制成功', {
        showCancelButton: false,
        confirmButtonText: '确认',
        type: 'success'
      })
    }
  })
}

const resertConfig = () => {
  resetLayoutConfig()
  message.success('重置成功')
}
</script>

<style lang="scss" scoped>
.setting {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.setting-body {
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  box-sizing: border-box;
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
