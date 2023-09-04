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
                <span class="icon" v-if="item.meta.icon">
                  <icon-selector :icon="item.meta.icon" :size="fontSize + 5" />
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
          <span style="cursor: pointer" class="operate-btn">
            <el-icon><ArrowDown /></el-icon>
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
import { onMounted, ref, watchEffect } from 'vue'

import type { TabsPaneContext } from 'element-plus'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import { useTabPageStore } from '@/store'
import { storeToRefs } from 'pinia'
import router from '@/router'
import { ArrowDown, Refresh, Close, Upload, CircleClose } from '@element-plus/icons-vue'
import { useReloadPage } from '@/hooks'
import { REDIRECT_NAME } from '@/router/constant'
import { IconSelector } from '@/components/icon'

interface Props {
  bgColor?: string
  textColor?: string
  activeTextColor?: string
  activeBgColor?: string
  dotColor?: string
  borderColor?: string
  fontSize?: number
}

withDefaults(defineProps<Props>(), {
  // 禁止删除的路由
  bgColor: 'white',
  textColor: '#495060',
  activeTextColor: 'white',
  activeBgColor: '#42b983',
  dotColor: 'white',
  borderColor: '#d8dce5',
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
$base-padding: 7px;
$base-color-white: #fff;
//顶部多标签页tabs-bar的高度

//顶部多标签页tabs-bar中每一个item的高度
$base-tag-item-height: 29px;

$base-border-color: #dcdfe6;
$base-border-radius: 2px;
$base-color-default: #409eff;
$base-color-blue: $base-color-default;
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

  padding-left: $base-padding;
  user-select: none;
  background: $base-color-white;
  // border-top: 1px solid #f6f6f6;

  // ::v-deep {
  //   .fold-unfold {
  //     margin-right: $base-padding;
  //   }
  // }

  :deep(.el-tabs__nav-wrap) {
    margin-bottom: 0px;
    min-width: 100%;
    max-width: 100%;
    height: 100%;
  }

  .tab-scroll {
    max-width: calc(100% - 90px);
    min-width: calc(100% - 90px);
    height: 100%;
    overflow: hidden;
  }

  :deep(.tabs-content) {
    height: 100%;
    overflow: hidden;
    // min-width: 0;
    // display: flex;
    // align-items: center;

    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      height: $base-tag-item-height;
      line-height: $base-tag-item-height;
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
        // line-height: $base-tag-item-height;
        border: 1px solid $base-border-color;
        // border-radius: $base-border-radius;
        transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
        padding: 0 7px;
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
  // display: inline-block;
  height: 100%;
  border-left: 1px solid #d9d9d9;
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
</style>
