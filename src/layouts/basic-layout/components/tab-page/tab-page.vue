<template>
  <div class="basic-layout-tabs__wrapper">
    <div class="tabs-bar-container">
      <div class="tab-scroll">
        <el-tabs
          :model-value="getCurrentActivityTabPage?.fullPath"
          type="card"
          class="tabs-content"
          @tab-click="handleTabClick"
          @tab-remove="handleTabRemove"
        >
          <el-tab-pane
            v-for="item in getTabPages"
            :key="item.fullPath"
            :name="item.fullPath"
            :closable="!affixTabsList.includes(item.fullPath)"
          >
            <template #label>
              <div class="tab-item" @contextmenu="contextmenuHandler($event, item.fullPath)">
                <span v-if="item.meta.icon" class="icon">
                  <pro-icon :icon="item.meta.icon" :size="fontSize" />
                </span>
                <span
                  :style="{
                    fontSize: `${fontSize}px`
                  }"
                  >{{ item.meta.title }}</span
                >
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
      <pro-context-menu
        ref="contextRef"
        :menus="getContextMenus('contextmenu')"
        :item-height="25"
        :font-size="12"
        style="width: 80px; font-size: 12px"
      />

      <div class="tabs-bar__operate">
        <el-dropdown trigger="click" style="height: 100%">
          <span class="operate-btn">
            <span>更多操作</span>
            <pro-icon icon="ep.arrow-down" :size="14"></pro-icon>
          </span>

          <template #dropdown>
            <el-dropdown-menu class="tabs-more">
              <el-dropdown-item command="reload" @click="reload">
                <el-icon><Refresh /></el-icon> 重新加载
              </el-dropdown-item>
              <el-dropdown-item command="closeOtherstabs" @click="removeOhterTabPages">
                <el-icon><Close /></el-icon> 关闭其他
              </el-dropdown-item>
              <el-dropdown-item command="closeLefttabs" @click="removeLeftAllTabPages">
                <el-icon
                  :style="{
                    transform: `rotate(-90deg)`
                  }"
                  ><Upload
                /></el-icon>
                关闭左侧
              </el-dropdown-item>
              <el-dropdown-item command="closeRighttabs" @click="removeRightAllTabPages">
                <el-icon
                  :style="{
                    transform: `rotate(90deg)`
                  }"
                  ><Upload
                /></el-icon>
                关闭右侧
              </el-dropdown-item>
              <el-dropdown-item command="closeAlltabs" @click="removeAllTabPage">
                <el-icon><CircleClose /></el-icon> 关闭全部
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue'

import { ElIcon, type TabsPaneContext } from 'element-plus'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import { useTabPageStore } from '@/store'
import { storeToRefs } from 'pinia'
import router from '@/router'
import { Refresh, Close, Upload, CircleClose } from '@element-plus/icons-vue'
import { useReloadPage } from '@/hooks'
import { REDIRECT_NAME } from '@/router/constant'
import { ProIcon } from '@/components/icon'
import { ProContextMenu, type ProContextMenuItem } from '@/components/context-menu'
interface Props {
  fontSize?: number
}

withDefaults(defineProps<Props>(), {
  fontSize: 14
})

const contextRef = ref()

const tabPageStore = useTabPageStore()

const { reload } = useReloadPage()

const { getTabPages, getCurrentActivityTabPage } = storeToRefs(tabPageStore)

const {
  isAffixTab,
  addTabPage,
  goTabPage,
  removeTabPage,
  removeAllTabPage,
  removeOhterTabPages,
  removeLeftAllTabPages,
  removeRightAllTabPages
} = tabPageStore

const route = useRoute()
const currentCheckedKey = ref('')

//禁止删除的 router tag name
const affixTabsList = ref<string[]>([])

const getContextMenus = (type: 'operate' | 'contextmenu'): ProContextMenuItem[] => {
  const fullPath =
    type === 'operate' ? getCurrentActivityTabPage.value?.fullPath : currentCheckedKey.value

  const atIndex = getTabPages.value.findIndex(tab => tab.fullPath === fullPath)

  const isCurrentTab =
    type === 'operate'
      ? true
      : getCurrentActivityTabPage.value?.fullPath === currentCheckedKey.value

  const affixTabCount = getTabPages.value.filter(tab => isAffixTab(tab)).length

  const defaultDisabled = affixTabCount === getTabPages.value.length

  return [
    {
      title: '重新加载',
      command: 'reload',
      onClick: reload,
      disabled: !isCurrentTab,
      icon: 'ep.refresh'
    },
    {
      title: '关闭其他',
      command: 'closeOtherstabs',
      icon: 'ep.close',
      onClick: () => {
        removeOhterTabPages()
      },
      disabled: defaultDisabled || !isCurrentTab
    },
    {
      title: '关闭左侧',
      command: 'closeLefttabs',
      onClick: () => {
        removeLeftAllTabPages()
      },
      disabled: !isCurrentTab || atIndex <= affixTabCount,
      icon: () =>
        h(
          ElIcon,
          {
            size: 12,
            style: {
              transform: `rotate(-90deg)`
            }
          },
          () => h(Upload)
        )
    },
    {
      title: '关闭右侧',
      command: 'closeRighttabs',
      onClick: removeRightAllTabPages,
      disabled: !isCurrentTab || atIndex === getTabPages.value.length - 1,
      icon: () =>
        h(
          ElIcon,
          {
            size: 12,
            style: {
              transform: `rotate(90deg)`
            }
          },
          () => h(Upload)
        )
    },
    {
      title: '关闭全部',
      command: 'closeAlltabs',
      onClick: removeAllTabPage,
      disabled: defaultDisabled,
      icon: 'ep.circle-close'
    }
  ]
}

onMounted(() => {
  initAffixTabs()

  watch(
    () => route,
    to => {
      if (to.name === REDIRECT_NAME) return

      // 子集的 meta 会继承 父级 meta, matched 中的 meta 保持原值
      const _to = to.matched.find(i => i.name === to.name)

      addTabPage({
        name: to.name as string,
        fullPath: to.fullPath,
        query: to.query,
        params: to.params,
        meta: _to?.meta || {}
      })
    },
    {
      deep: true,
      immediate: true
    }
  )
})

function contextmenuHandler(event: MouseEvent, fullPath: string) {
  event.preventDefault()

  currentCheckedKey.value = fullPath

  contextRef.value.show(event)
}

function initAffixTabs() {
  function filterAffixTab() {
    return router.getRoutes().filter(route => route.meta.affixTab)
  }

  affixTabsList.value = []

  filterAffixTab().forEach(route => {
    addTabPage({
      name: route.name as string,
      fullPath: route.path,
      query: {},
      params: {},
      meta: route.meta
    })
    affixTabsList.value.push(route.path)
  })
}

const handleTabClick = (context: TabsPaneContext) => {
  if (context.index === undefined) return

  const route = getTabPages.value[Number(context.index)]

  goTabPage(route)
}

const handleTabRemove = (fullPath: any) => {
  const atIndex = getTabPages.value.findIndex(item => item.fullPath === fullPath)
  removeTabPage(atIndex)
}
</script>

<style lang="scss" scoped>
.tabs-bar-container {
  --base-bg-color: #fff;
  --base-border-color: #d9e2ef;
  --base-item-height: 28px;
  --base-item-radius: 7px;
  --base-item-text-color: #475569;
  --base-item-active-bg: #eaf3ff;
  --base-item-active-color: var(--el-color-primary);
  --base-item-hover-bg: #f3f7fc;
  --base-item-active-border: #b7d5ff;
}

html.dark {
  .tabs-bar-container {
    --base-bg-color: rgba(20, 20, 20, 0.92);
    --base-border-color: var(--global-border-color);
    --base-item-hover-bg: rgba(22, 119, 255, 0.12);
    --base-item-active-bg: rgba(22, 119, 255, 0.2);
  }
}

.tabs-bar-container {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  user-select: none;
  background: var(--base-bg-color);

  :deep(.el-tabs__nav-wrap) {
    margin-bottom: 0;
    min-width: 0;
    width: 100%;
    max-width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .tab-scroll {
    flex: 1 1 auto;
    min-width: 0;
    height: 100%;
    overflow: hidden;
  }

  :deep(.tabs-content) {
    height: 100%;
    overflow: hidden;
    --el-tabs-header-height: var(--base-item-height);

    &.el-tabs--card > .el-tabs__header .el-tabs__nav {
      border: 0;
    }

    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      height: var(--base-item-height);
      line-height: var(--base-item-height);
      color: var(--base-item-text-color);
    }

    .el-tabs__nav-scroll {
      height: 100%;
    }

    .el-tabs__header {
      border-bottom: 0;
      margin-bottom: 0;
      height: 100% !important;
      display: flex;
      align-items: center;

      .el-tabs__nav {
        border: 0;
        height: 100%;
        display: flex;
        align-items: center;
      }

      .el-tabs__nav-wrap::after,
      .el-tabs__nav-prev,
      .el-tabs__nav-next {
        border: 0;
        box-shadow: none;
      }

      .el-tabs__item {
        box-sizing: border-box;
        height: var(--base-item-height);
        line-height: calc(var(--base-item-height) - 2px);
        margin-right: 7px;
        border: 1px solid var(--base-border-color) !important;
        transition:
          background-color 0.16s ease,
          border-color 0.16s ease,
          color 0.16s ease !important;
        padding: 0 10px;
        border-radius: var(--base-item-radius);
        color: var(--base-item-text-color);
        background: #fff;
        font-size: 13px;
        font-weight: 500;
        box-shadow: none;

        &:hover {
          background: var(--base-item-hover-bg);
          color: var(--global-text-color-regular);
          border-color: #c8d6e6;
        }

        &.is-active {
          background: var(--base-item-active-bg);
          color: var(--base-item-active-color);
          border-color: var(--base-item-active-border) !important;
          font-weight: 600;
        }
      }

      .is-icon-close {
        width: 16px;
        height: 16px;
        margin-left: 6px;
        border-radius: 999px;
        transition:
          background-color 0.2s ease,
          color 0.2s ease;

        &:hover {
          background: rgba(15, 23, 42, 0.08);
          color: var(--global-heading-color);
        }
      }
    }
  }

  .more {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}

.tabs-bar {
  &__operate {
    height: var(--base-item-height);
    box-sizing: border-box;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.operate-btn {
  min-width: 84px;
  box-sizing: border-box;
  flex-shrink: 0;
  height: var(--base-item-height);
  border: 1px solid var(--base-border-color);
  border-radius: var(--base-item-radius);
  color: var(--base-item-text-color);
  cursor: pointer;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 10px;
  font-size: 13px;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: var(--base-item-hover-bg);
    border-color: #d8e4ff;
    color: var(--global-heading-color);
  }
}

.tab-item {
  display: flex;
  align-items: center;
  font-weight: inherit;
  gap: 6px;

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0;
  }
}

html.dark {
  .operate-btn {
    background: rgba(20, 20, 20, 0.92);
    color: var(--global-text-color-regular);
  }

  .tabs-bar-container {
    :deep(.tabs-content .el-tabs__header .el-tabs__item) {
      background: rgba(20, 20, 20, 0.92);

      &:hover {
        border-color: rgba(22, 119, 255, 0.24);
      }
    }
  }
}
</style>
