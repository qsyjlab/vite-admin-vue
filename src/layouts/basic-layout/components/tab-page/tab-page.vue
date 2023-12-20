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
              <div class="tab-item">
                <span v-if="item.meta.icon" class="icon">
                  <icon-selector :icon="item.meta.icon" :size="fontSize" />
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

      <div class="tabs-bar__operate">
        <el-dropdown style="height: 100%">
          <span class="operate-btn">
            <!-- <el-icon><ArrowDown /></el-icon> -->
            <icon-selector icon="ep.arrow-down" :size="16"></icon-selector>
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
import { onMounted, ref } from 'vue'

import type { TabsPaneContext } from 'element-plus'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import { useTabPageStore } from '@/store'
import { storeToRefs } from 'pinia'
import router from '@/router'
import { Refresh, Close, Upload, CircleClose } from '@element-plus/icons-vue'
import { useReloadPage } from '@/hooks'
import { REDIRECT_NAME } from '@/router/constant'
import { IconSelector } from '@/components/icon'

interface Props {
  fontSize?: number
}

withDefaults(defineProps<Props>(), {
  fontSize: 14
})

const tabPageStore = useTabPageStore()

const { reload } = useReloadPage()

const { getTabPages, getCurrentActivityTabPage } = storeToRefs(tabPageStore)

const {
  addTabPage,
  goTabPage,
  removeTabPage,
  removeAllTabPage,
  removeOhterTabPages,
  removeLeftAllTabPages,
  removeRightAllTabPages
} = tabPageStore

const route = useRoute()

//禁止删除的 router tag name
const affixTabsList = ref<string[]>([])

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
  if (!context.index) return

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
  --base-padding: 7px;
  --base-bg-color: #fff;
  --base-border-color: #dcdfe6;
  --base-item-height: 29px;
}

html.dark {
  .tabs-bar-container {
    --base-bg-color: transparent;
    --base-border-color: var(--global-border-color);
  }
}

.tabs-bar-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  padding: 3px;

  padding-left: var(--base-padding);
  user-select: none;
  background: var(--base-bg-color);

  :deep(.el-tabs__nav-wrap) {
    margin-bottom: 0px;
    min-width: 100%;
    max-width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .tab-scroll {
    max-width: calc(100% - 38px);
    min-width: calc(100% - 38px);
    height: 100%;
    overflow: hidden;
  }

  :deep(.tabs-content) {
    height: 100%;
    overflow: hidden;

    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      height: var(--base-item-heigh);
      line-height: var(--base-item-heigh);
    }

    .el-tabs__nav-scroll {
      height: 100%;
    }

    .el-tabs__header {
      border-bottom: 0;
      margin-bottom: 0;
      height: 100% !important;

      .el-tabs__nav {
        border: 0;
        height: 100%;
      }

      .el-tabs__item {
        box-sizing: border-box;
        height: 100%;
        margin-right: 5px;
        border: 1px solid var(--base-border-color);

        transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
        padding: 0 7px;
        border-radius: 3px;
        &.is-active {
          background-color: var(--el-color-primary);
          color: white;
          border-width: 0;
          // border: 1px solid $base-color-blue;
        }
      }
    }
  }
  .more {
    display: flex;
    align-content: center;
    align-items: center;
    cursor: pointer;
  }
}

.tabs-bar {
  &__operate {
    height: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.operate-btn {
  width: 38px;
  box-sizing: border-box;
  flex-shrink: 0;
  cursor: pointer;
  height: 100%;
  border-left: 1px solid var(--base-border-color);
  color: rgba(0, 0, 0, 0.45);
  // line-height: 30px;
  text-align: center;
  cursor: pointer;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-item {
  display: flex;
  align-items: center;
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
  }
}

html.dark {
  .operate-btn {
    color: var(--global-text-color-regular);
  }
}
</style>
