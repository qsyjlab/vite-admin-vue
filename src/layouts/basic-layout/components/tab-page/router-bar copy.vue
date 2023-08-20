<template>
  <div class="basic-layout-tabs__wrapper">
    <div class="tabs-bar-container">
      <div class="tab-scroll">
        <el-tabs
          v-model="tabActive"
          type="card"
          class="tabs-content"
          @tab-click="handleTabClick"
          @tab-remove="handleTabRemove"
        >
          <el-tab-pane
            v-for="item in routerList"
            :key="item.fullPath"
            :label="item.meta.title"
            :name="item.fullPath"
            :closable="!biddenRouter.includes(item.name)"
          ></el-tab-pane>
        </el-tabs>
      </div>

      <div class="tabs-bar__operate">
        <el-dropdown>
          <span style="cursor: pointer"> 更多操作 </span>

          <template #dropdown>
            <el-dropdown-menu class="tabs-more">
              <el-dropdown-item command="closeOtherstabs" @click="removeOtherRouterBar">
                关闭其他
              </el-dropdown-item>
              <el-dropdown-item command="closeLefttabs" @click="removeLeftAllRouterBar">
                关闭左侧
              </el-dropdown-item>
              <el-dropdown-item command="closeRighttabs" @click="removeRightAllRouterBar">
                关闭右侧
              </el-dropdown-item>
              <el-dropdown-item command="closeAlltabs" @click="removeAllRouterBar">
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
import { useRouter } from 'vue-router'

import { tranformRouterInfo } from './router-bar'
import type { RouteLocationNormalized } from 'vue-router'
import type { RouterType } from './router-bar'

import type { TabsPaneContext } from 'element-plus'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import { useTabPageStore } from '@/store'
import { storeToRefs } from 'pinia'

interface Props {
  biddenRouter?: string[]
  bgColor?: string
  textColor?: string
  activeTextColor?: string
  activeBgColor?: string
  dotColor?: string
  borderColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  // 禁止删除的路由
  biddenRouter: () => [],
  bgColor: 'white',
  textColor: '#495060',
  activeTextColor: 'white',
  activeBgColor: '#42b983',
  dotColor: 'white',
  borderColor: '#d8dce5'
})

const tabPageStore = useTabPageStore()

const { getTabPages, getCurrentActivityTabPage } = storeToRefs(tabPageStore)
const { addTabPage } = tabPageStore

const router = useRouter()
const route = useRoute()

const currentRouter = ref<RouterType | null>(null)
// 存放路由列表
const routerList = ref<RouterType[]>([])
//禁止删除的 router tag name
const biddenRouter = ref<string[]>(props.biddenRouter)

const tabActive = ref<string>('')

// onBeforeRouteUpdate((to, from, next) => {
//   routerChangeUpdate(to)
//   next()
// })

onMounted(() => {
  // 开始初始化一次
  initRouterList()

  watch(
    () => route,
    to => {
      routerChangeUpdate(to)
    },
    {
      deep: true,
      immediate: true
    }
  )
  // routerChangeUpdate(router.currentRoute.value)
})

const routerChangeUpdate = (_router: RouteLocationNormalized) => {
  // 如果 routeList 为空数组 直接添加
  if (routerList.value.length === 0) return routerList.value.push(tranformRouterInfo(_router))

  //    如果有此对象不做任何事
  const findSameRouter = routerList.value.find(
    item => item.name === _router.name && item.fullPath === _router.fullPath
  )
  // 否则 添加 新router object
  if (!findSameRouter) routerList.value.push(tranformRouterInfo(_router))

  // 切换当前router object
  currentRouter.value = tranformRouterInfo(_router)
  tabActive.value = currentRouter.value.fullPath
}

//初始化路由数组
const initRouterList = (): void => {
  routerList.value = []
  const routes = router.getRoutes()

  for (const item of routes) {
    if (biddenRouter.value.includes(item?.name as string)) {
      routerList.value.push({
        fullPath: item.path,
        path: item?.path,
        name: item.name as string,
        meta: item.meta,
        params: {},
        query: {}
      })
    }
  }

  currentRouter.value = tranformRouterInfo(router.currentRoute.value)

  tabActive.value = currentRouter.value.fullPath || ''
}

// 删除路由导航tag
const removeRouterBar = (index: number) => {
  routerList.value.splice(index, 1)

  currentRouter.value = routerList.value[routerList.value.length - 1]

  goRouter(currentRouter.value)
}

// 跳转路由
const goRouter = (curPath: RouterType): void => {
  if (!curPath) return

  currentRouter.value = curPath

  router.push({ path: curPath.fullPath })
}

const isAffixTab = (name: string) => {
  return props.biddenRouter.includes(name)
}

// 移除全部
const removeAllRouterBar = () => {
  initRouterList()

  if (props.biddenRouter.length) {
    goRouter(routerList.value[0])
  }
}

// 移除其他
const removeOtherRouterBar = () => {
  initRouterList()

  if (currentRouter.value) {
    routerList.value.push(currentRouter.value)
  }
}

// 移除左侧
const removeLeftAllRouterBar = () => {
  let atIndex = routerList.value.findIndex(i => i.fullPath === currentRouter.value?.fullPath)

  if (atIndex === -1) return

  for (let i = 0; i < atIndex; i++) {
    const item = routerList.value[i]

    if (isAffixTab(item.name)) continue

    routerList.value.splice(i, 1)
    i--
    atIndex--
  }
}

// 移除右侧
const removeRightAllRouterBar = () => {
  if (!routerList.value.length) return
  let atIndex = routerList.value.findIndex(i => i.fullPath === currentRouter.value?.fullPath)

  if (atIndex === -1) return

  for (let i = routerList.value.length - 1; i > atIndex; i--) {
    routerList.value.splice(i, 1)
  }
}

const handleTabClick = (context: TabsPaneContext) => {
  if (!context.index) return

  const route = routerList.value[Number(context.index)]

  goRouter(route)
}

const handleTabRemove = (name: any) => {
  const atIndex = routerList.value.findIndex(item => item.fullPath === name)

  removeRouterBar(atIndex)
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
