<template>
  <el-drawer
    class="layout-setting-drawer"
    :model-value="isOpenSettig"
    :with-header="false"
    direction="rtl"
    size="420px"
  >
    <div class="setting">
      <header class="setting-header">
        <h2>系统布局配置</h2>
        <el-button
          class="setting-header__close"
          :icon="Close"
          text
          circle
          aria-label="关闭布局设置"
          @click="layoutStore.toggleSettingDrawer()"
        />
      </header>

      <div class="setting-body">
        <section class="setting-section">
          <h3>主题</h3>
          <div class="setting-item">
            <span class="setting-item__label">主题色</span>
            <el-color-picker
              :model-value="layoutConfig.themeColor"
              @change="(value: any) => setLayoutConfig(LayoutConfigHandlerEnum.THEME_COLOR, value)"
            />
          </div>
          <div class="setting-item">
            <span class="setting-item__label">深色侧边栏</span>
            <el-switch
              :model-value="layoutConfig.sidebarTheme === 'dark'"
              :disabled="layoutConfig.theme === 'dark'"
              @change="
                (value: any) =>
                  setLayoutConfig(LayoutConfigHandlerEnum.SIDEBAR_THEME, value ? 'dark' : 'light')
              "
            />
          </div>
          <div class="setting-item">
            <span class="setting-item__label">深色顶部导航</span>
            <el-switch
              :model-value="layoutConfig.headerTheme === 'dark'"
              :disabled="layoutConfig.theme === 'dark'"
              @change="
                (value: any) =>
                  setLayoutConfig(LayoutConfigHandlerEnum.HEADER_THEME, value ? 'dark' : 'light')
              "
            />
          </div>
          <div
            v-if="layoutConfig.sidebarTheme === 'dark' || layoutConfig.headerTheme === 'dark'"
            class="setting-item"
          >
            <span class="setting-item__label">深色菜单背景</span>
            <el-color-picker
              :model-value="layoutConfig.darkMenuBackground"
              :disabled="layoutConfig.theme === 'dark'"
              @change="
                (value: any) => setLayoutConfig(LayoutConfigHandlerEnum.DARK_MENU_BACKGROUND, value)
              "
            />
          </div>
        </section>

        <section class="setting-section">
          <h3>导航模式</h3>
          <CheckButtonGroup
            :model-value="layoutConfig.layoutMode"
            :options="layoutModeOptions"
            @change="(value: any) => setLayoutConfig(LayoutConfigHandlerEnum.LAYOUT_MODE, value)"
          />
        </section>

        <section class="setting-section">
          <h3>权限模式</h3>
          <el-segmented
            :model-value="permissionStore.getPermissionMode()"
            :options="permissionModeOptions"
            :disabled="modeSwitching"
            @change="handlePermissionModeChange"
          />
          <p class="setting-section__hint">{{ currentPermissionModeDesc }}</p>
        </section>

        <section class="setting-section">
          <h3>菜单</h3>
          <div class="setting-item">
            <span class="setting-item__label">折叠菜单</span>
            <el-switch
              :model-value="layoutConfig.collapsed"
              @change="(value: any) => setLayoutConfig(LayoutConfigHandlerEnum.COLLAPSED, value)"
            />
          </div>
          <div class="setting-item">
            <span class="setting-item__label">分割菜单</span>
            <el-switch
              :model-value="layoutConfig.splitMenu"
              :disabled="LayoutMode.TopMix !== layoutConfig.layoutMode"
              @change="(value: any) => setLayoutConfig(LayoutConfigHandlerEnum.SPLIT_MENU, value)"
            />
          </div>
          <div
            v-if="layoutConfig.layoutMode === LayoutMode.TopMix && layoutConfig.splitMenu"
            class="setting-item"
          >
            <span class="setting-item__label">无子菜单时显示侧栏</span>
            <el-switch
              :model-value="layoutConfig.showEmptySplitMenuSidebar"
              @change="
                (value: any) =>
                  setLayoutConfig(LayoutConfigHandlerEnum.SHOW_EMPTY_SPLIT_MENU_SIDEBAR, value)
              "
            />
          </div>
          <div class="setting-item">
            <span class="setting-item__label">菜单展开宽度</span>
            <el-input-number
              :model-value="layoutConfig.asideWidth"
              @change="(value: any) => setLayoutConfig(LayoutConfigHandlerEnum.MENU_WIDTH, value)"
            />
          </div>
        </section>

        <section class="setting-section">
          <h3>页面区域</h3>
          <div class="setting-item">
            <span class="setting-item__label">面包屑导航</span>
            <el-switch
              :model-value="layoutConfig.showBreadCrumb"
              @change="
                (value: any) => setLayoutConfig(LayoutConfigHandlerEnum.SHOW_BREAD_CRUMB, value)
              "
            />
          </div>
          <div class="setting-item">
            <span class="setting-item__label">标签页</span>
            <el-switch
              :model-value="layoutConfig.showTagPage"
              @change="
                (value: any) => setLayoutConfig(LayoutConfigHandlerEnum.SHOW_TAB_PAGE, value)
              "
            />
          </div>
          <div class="setting-item">
            <span class="setting-item__label">页脚</span>
            <el-switch
              :model-value="layoutConfig.showFooter"
              @change="(value: any) => setLayoutConfig(LayoutConfigHandlerEnum.SHOW_FOOTER, value)"
            />
          </div>
        </section>

        <section class="setting-section">
          <h3>尺寸</h3>
          <div class="setting-dimension-grid">
            <label class="setting-dimension">
              <span>头部高度</span>
              <el-input-number
                :model-value="layoutConfig.headerHeight"
                @change="
                  (value: any) => setLayoutConfig(LayoutConfigHandlerEnum.HEADER_HEIGHT, value)
                "
              />
            </label>
            <label class="setting-dimension">
              <span>标签页高度</span>
              <el-input-number
                :model-value="layoutConfig.tabBarHeight"
                @change="
                  (value: any) => setLayoutConfig(LayoutConfigHandlerEnum.TAB_BAR_HEIGHT, value)
                "
              />
            </label>
          </div>
        </section>
      </div>

      <footer class="setting-footer">
        <el-button :icon="CopyDocument" type="primary" @click="copyJsonConfig">复制配置</el-button>
        <el-button :icon="Refresh" @click="resertConfig">重置</el-button>
      </footer>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Close, CopyDocument, Refresh } from '@element-plus/icons-vue'
import { useLayoutStore, usePermissionStore } from '@/store'
import { useLayoutConfigHandler, LayoutConfigHandlerEnum, useMessage } from '@/hooks'
import { copyToClipboard } from '@/utils'
import { PermissionModeEnum } from '@/enum'

import { LayoutMode } from '../../enum'
import CheckButtonGroup from './check-button-group.vue'
import { LeftSideMix, NavTop, SideTopMix, LeftSide } from './icon'

const { message, messageBox } = useMessage()
const layoutStore = useLayoutStore()
const permissionStore = usePermissionStore()
const router = useRouter()
const { layoutConfig, setLayoutConfig, getProjectSetting, resetLayoutConfig } =
  useLayoutConfigHandler()
const { isOpenSettig } = storeToRefs(layoutStore)

const layoutModeOptions = [
  { title: '侧边栏布局', value: LayoutMode.Side, icon: LeftSide },
  { title: '顶部菜单布局', value: LayoutMode.Top, icon: NavTop },
  { title: '顶部混合菜单', value: LayoutMode.TopMix, icon: SideTopMix },
  { title: '左侧菜单混合', value: LayoutMode.SideMix, icon: LeftSideMix }
]

// ─── 权限模式切换 ──────────────────────────────────────────────
const modeSwitching = ref(false)
const permissionModeOptions = [
  { label: '路由映射', value: PermissionModeEnum.ROUTE_MAPPING },
  { label: '角色映射', value: PermissionModeEnum.ROLE },
  { label: '后端菜单', value: PermissionModeEnum.BACKED }
]
const permissionModeDescMap: Record<string, string> = {
  [PermissionModeEnum.ROUTE_MAPPING]: '按用户拥有的路由 name 列表过滤菜单与路由',
  [PermissionModeEnum.ROLE]: '按路由 meta.roles 过滤，父路由不匹配时整棵子树移除',
  [PermissionModeEnum.BACKED]: '后端返回菜单树，前端动态渲染路由'
}
const currentPermissionModeDesc = computed(
  () => permissionModeDescMap[permissionStore.getPermissionMode()] || ''
)

async function handlePermissionModeChange(value: string | number | boolean | undefined) {
  const mode = value as keyof typeof PermissionModeEnum
  try {
    await messageBox.confirm('切换权限模式将重新生成路由并跳转到首页，是否继续？', '切换权限模式', {
      type: 'warning',
      confirmButtonText: '切换',
      cancelButtonText: '取消'
    })
  } catch {
    return // 用户取消，model-value 绑定 store 原值，segmented 自动回退
  }
  modeSwitching.value = true
  permissionStore.setPermissionMode(mode)
  await permissionStore.loadDynamicRoutes()
  modeSwitching.value = false
  message.success('权限模式已切换')
  layoutStore.isOpenSettig = false
  router.replace({ name: 'Welcome' })
}

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
  color: var(--el-text-color-regular);
}

.setting-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  padding: 0 20px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--el-border-color-lighter);

  h2 {
    margin: 0;
    color: var(--el-text-color-primary);
    font-size: 20px;
    line-height: 1.4;
    letter-spacing: 0;
  }
}

.setting-header__close {
  width: 32px;
  height: 32px;
}

.setting-body {
  min-height: 0;
  padding: 4px 20px 20px;
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
}

.setting-section {
  padding: 16px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:last-child {
    border-bottom: 0;
  }

  h3 {
    margin: 0 0 10px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 0;
  }

  &__hint {
    margin: 8px 0 0;
    color: var(--el-text-color-secondary);
    font-size: 12px;
    line-height: 1.5;
  }

  :deep(.el-segmented) {
    width: 100%;
  }
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  gap: 16px;
  font-size: 14px;

  &__label {
    color: var(--el-text-color-regular);
    font-weight: 500;
  }
}

.setting-dimension-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.setting-dimension {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  color: var(--el-text-color-regular);
  font-size: 13px;
  font-weight: 500;
}

.setting-footer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 10px;
  padding: 14px 20px;
  flex-shrink: 0;
  border-top: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);

  :deep(.el-button) {
    width: 100%;
    height: 38px;
    margin: 0;
  }
}

.layout-setting-drawer {
  :deep(.el-drawer) {
    background: var(--el-bg-color);
  }

  :deep(.el-drawer__body) {
    padding: 0;
    background: var(--el-bg-color);
  }

  :deep(.el-color-picker__trigger) {
    width: 36px;
    height: 36px;
    border-radius: var(--el-border-radius-base);
    border-color: var(--el-border-color);
  }

  :deep(.el-switch) {
    --el-switch-on-color: var(--el-color-primary);
    --el-switch-off-color: var(--el-border-color);
  }

  :deep(.el-input-number) {
    width: 126px;
  }

  .setting-dimension :deep(.el-input-number) {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .layout-setting-drawer {
    :deep(.el-drawer) {
      width: calc(100vw - 16px) !important;
    }
  }

  .setting-header {
    min-height: 56px;
    padding: 0 16px;

    h2 {
      font-size: 18px;
    }
  }

  .setting-body {
    padding-right: 16px;
    padding-left: 16px;
  }

  .setting-footer {
    padding-right: 16px;
    padding-left: 16px;
  }
}
</style>
