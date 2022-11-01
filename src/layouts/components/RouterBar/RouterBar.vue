<template>
  <el-scrollbar
    style="height: 100%"
    noresize
    view-class="scroll-view-class"
    wrap-class="scroll-wrap-class"
  >
    <div class="router-container">
      <div
        v-for="(item, index) in routerList"
        :key="index"
        :class="['routerbar-item', item.fullPath == currentRouter?.fullPath ? 'active' : '']"
        :style="{
          backgroundColor: item.fullPath == currentRouter?.fullPath ? activeBgColor : bgColor,
          borderColor: item.fullPath == currentRouter?.fullPath ? activeBgColor : borderColor
        }"
        @click="goRouter(item)"
      >
        <div v-if="item.fullPath == currentRouter?.fullPath" class="active-dot"></div>
        <div>
          {{ item?.meta?.title }}
        </div>
        <div
          v-if="!biddenRouter.includes(item.name) && item.fullPath == currentRouter?.fullPath"
          class="close-icon-style"
          @click="removeRouterBar($event, index)"
        >
          <icon-close :size="18" />
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>
<script lang="ts">
export default {
  name: 'QsRouterBar'
}
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, RouteLocationNormalized, useRouter } from 'vue-router'

import { tranformRouterInfo } from './routerBar'

import type { RouteRecordNormalized } from 'vue-router'
import type { RouterType } from './routerBar'

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

const router = useRouter()

const currentRouter = ref<RouterType | null>(null)
// 存放路由列表
const routerList = ref<RouterType[]>([])
//禁止删除的 router tag name
const biddenRouter = ref<string[]>(props.biddenRouter)

onBeforeRouteUpdate((to, from, next) => {
  watchRouterChange(to)
  next()
})

onMounted(() => {
  // 开始初始化一次
  initRouterList()

  watchRouterChange(router.currentRoute.value)
})

//初始化路由数组
const initRouterList = (): void => {
  const routes: RouteRecordNormalized[] = router.getRoutes()

  for (const item of routes) {
    if (biddenRouter.value.includes(item?.name as string)) {
      routerList.value.push(tranformRouterInfo(item))
    }
  }

  currentRouter.value = tranformRouterInfo(router.currentRoute.value)
}

// 删除路由导航tag
const removeRouterBar = (e: Event, index: number) => {
  e.stopPropagation()

  routerList.value.splice(index, 1)

  currentRouter.value = routerList.value[routerList.value.length - 1]

  goRouter(currentRouter.value)
}

// 跳转路由
const goRouter = (curPath: RouterType): void => {
  if (!curPath) return

  currentRouter.value = curPath

  router.push({
    name: curPath.name,
    query: Object.keys(curPath.query).length ? curPath.query : {},
    params: Object.keys(curPath.params).length ? curPath.params : {}
  })
}
// 监听路由变化
const watchRouterChange = (_router: RouteLocationNormalized) => {
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
}
</script>

<style lang="scss" scoped>
.router-container {
  min-width: 600px;
  display: flex;
  height: 100%;
  box-sizing: border-box;
  padding: 0 3px;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04); */
  align-items: center;
}
.routerbar-item {
  padding: 5px 6px;
  font-size: 13px;
  margin-left: 7px;
  cursor: pointer;
  color: #495060;
  border: 1px solid #d8dce5;
  flex-shrink: 0;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
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
