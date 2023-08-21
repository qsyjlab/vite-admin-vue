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
            :label="item.meta.title"
            :name="item.fullPath"
            :closable="!affixTabsList.includes(item.fullPath)"
          ></el-tab-pane>
        </el-tabs>
      </div>

      <div class="tabs-bar__operate">
        <el-dropdown>
          <span style="cursor: pointer"> 更多操作 </span>

          <template #dropdown>
            <el-dropdown-menu class="tabs-more">
              <el-dropdown-item command="closeOtherstabs" @click="removeOhterTabPages">
                关闭其他
              </el-dropdown-item>
              <el-dropdown-item command="closeLefttabs" @click="removeLeftAllTabPages">
                关闭左侧
              </el-dropdown-item>
              <el-dropdown-item command="closeRighttabs" @click="removeRightAllTabPages">
                关闭右侧
              </el-dropdown-item>
              <el-dropdown-item command="closeAlltabs" @click="removeAllTabPage">
                关闭全部
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

interface Props {
  bgColor?: string
  textColor?: string
  activeTextColor?: string
  activeBgColor?: string
  dotColor?: string
  borderColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  // 禁止删除的路由
  bgColor: 'white',
  textColor: '#495060',
  activeTextColor: 'white',
  activeBgColor: '#42b983',
  dotColor: 'white',
  borderColor: '#d8dce5'
})

const tabPageStore = useTabPageStore()

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
      addTabPage({
        name: to.name as string,
        fullPath: to.fullPath,
        query: to.query,
        params: to.params,
        meta: to.meta
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
// //初始化路由数组
// const initRouterList = (): void => {
//   routerList.value = []
//   const routes = router.getRoutes()

//   for (const item of routes) {
//     if (biddenRouter.value.includes(item?.name as string)) {
//       routerList.value.push({
//         fullPath: item.path,
//         path: item?.path,
//         name: item.name as string,
//         meta: item.meta,
//         params: {},
//         query: {}
//       })
//     }
//   }

//   currentRouter.value = tranformRouterInfo(router.currentRoute.value)

//   tabActive.value = currentRouter.value.fullPath || ''
// }

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
$base-tabs-bar-height: px;
//顶部多标签页tabs-bar中每一个item的高度
$base-tag-item-height: 29px;

$base-border-color: #dcdfe6;
$base-border-radius: 2px;
$base-color-default: #409eff;
$base-color-blue: $base-color-default;
.tabs-bar-container {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  // height: $base-tabs-bar-height;
  padding-right: $base-padding;
  padding-left: $base-padding;
  user-select: none;
  background: $base-color-white;
  // border-top: 1px solid #f6f6f6;

  // ::v-deep {
  //   .fold-unfold {
  //     margin-right: $base-padding;
  //   }
  // }

  // :deep(.el-tabs__nav-wrap) {
  //   min-width: 100%;
  //   max-width: 100%;
  // }

  .tab-scroll {
    max-width: calc(100% - 90px);
    min-width: calc(100% - 90px);
    overflow: hidden;
  }

  :deep(.tabs-content) {
    height: $base-tag-item-height;
    overflow: hidden;

    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      height: $base-tag-item-height;
      line-height: $base-tag-item-height;
    }

    .el-tabs__header {
      border-bottom: 0;

      .el-tabs__nav {
        border: 0;
      }

      .el-tabs__item {
        box-sizing: border-box;
        height: $base-tag-item-height;
        margin-right: 5px;
        line-height: $base-tag-item-height;
        border: 1px solid $base-border-color;
        border-radius: $base-border-radius;
        transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
        padding: 0 7px;
        &.is-active {
          border: 1px solid $base-color-blue;
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
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.router-container {
  min-width: 600px;
  display: flex;
  height: 100%;
  box-sizing: border-box;
  padding: 3px;
  // box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  align-items: center;
}

.routerbar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  box-sizing: border-box;
  padding: 5px 6px;
  font-size: 13px;
  margin-left: 7px;
  cursor: pointer;
  color: #495060;
  border: 1px solid #d8dce5;
  flex-shrink: 0;
  transition: all 0.3s;
  border-radius: 3px;
}

.active-dot {
  width: 10px;
  height: 10px;
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 50%;
  margin-right: 6px;
}

.routerbar-item.active {
  background-color: #42b983;
  border-color: #42b983;
  color: white;
}

.scrollbarClass {
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-icon-style {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
}

:deep(.scroll-view-class) {
  height: 100%;
}

:deep(.scroll-wrap-class) {
  height: 100%;
}
</style>
