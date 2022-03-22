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
        @click="goRouter(item)"
      >
        <div v-if="item.fullPath == currentRouter?.fullPath" class="active-dot"></div>
        <div>
          <span
            v-if="Object.keys(item.query).length === 0 && Object.keys(item.params).length === 0"
          >
            {{ item?.meta?.title }}
          </span>
          <span
            v-else-if="
              Object.keys(item.query).length !== 0 && Object.keys(item.params).length === 0
            "
          >
            {{ item?.meta?.title }} - {{ item.query.id }}
          </span>
          <span
            v-else-if="
              Object.keys(item.query).length === 0 && Object.keys(item.params).length !== 0
            "
          >
            {{ item?.meta?.title }} - {{ item.params.id }}
          </span>
        </div>
        <div
          v-if="!biddenRouter.includes(item.name)"
          class="close-icon-style"
          @click="removeRouterBar($event, index)"
        >
          <el-icon> <icon-close /> </el-icon>
        </div>
        <!-- <span class="iconfont icon-searchclose"></span> -->
      </div>
    </div>
  </el-scrollbar>
</template>
<script lang="ts">
import { onMounted, ref, watch, defineComponent } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'

export default defineComponent({
  name: 'QsRouterBar',
  setup() {
    const router = useRouter()
    // 存放路由列表
    const currentRouter = ref<any | null>(null)
    const routerList = ref<any[]>([])
    //禁止删除的 router tag name
    const biddenRouter = ref<string[]>(['Dashboard'])

    onMounted(() => {
      // 开始初始化一次
      initRouterList()

      watchRouterChange(router.currentRoute.value)
    })

    onBeforeRouteUpdate((to, from, next) => {
      console.log('before to')
      next()
    })

    watch(
      () => router.currentRoute.value,
      newVal => {
        watchRouterChange(newVal)
      }
    )

    //初始化路由数组
    const initRouterList = (): void => {
      let routes: any[] = router.getRoutes() as any

      routes = routes.filter(item => {
        if (biddenRouter.value.includes(item?.name)) return item
      })

      if (routes.length) {
        let filter: any = {
          fullPath: routes[0]?.path,
          path: routes[0]?.path,
          name: routes[0].name,
          meta: routes[0].meta,
          params: {},
          query: {}
        }
        routerList.value.push(filter)
      }

      currentRouter.value = router.currentRoute.value as any
    }

    // 删除路由导航tag
    const removeRouterBar = (e: Event, index: number) => {
      // console.log( )
      e.stopPropagation()
      // e.cancelBubble = true
      // return

      routerList.value.splice(index, 1)

      currentRouter.value = routerList.value[routerList.value.length - 1]
      // console.log(currentRouter.value.fullPath)
      goRouter(currentRouter.value)
    }

    // 跳转路由
    const goRouter = (curPath: any): void => {
      currentRouter.value = curPath

      router.push({
        name: curPath.name,
        query: Object.keys(curPath.query).length ? curPath.query : {},
        params: Object.keys(curPath.params).length ? curPath.params : {}
      })
    }
    // 监听路由变化
    const watchRouterChange = (_router: any) => {
      // 如果 routeList 为空数组 直接添加
      if (routerList.value.length === 0) return routerList.value.push(_router)
      else {
        //    如果有此对象不做任何事
        const findSameRouter = routerList.value.find(
          item => item.name === _router.name && item.fullPath === _router.fullPath
        )
        // 否则 添加 新router object
        if (!findSameRouter) routerList.value.push(_router)

        // 切换当前router object
        currentRouter.value = _router
      }
    }

    return {
      routerList,
      currentRouter,
      goRouter,
      removeRouterBar,
      biddenRouter
    }
  }
})
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
// .routerbar-item.active::before {
//   width: 10px;
//   height: 10px;
//   display: flex;
//   align-items: center;
//   background-color: white;
//   border-radius: 50%;
//   margin-right: 6px;
//   content: '';
// }

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

/* .el-scrollbar {
  overflow-y: hidden;
  height: 100%;
} */
/* .el-scrollbar .el-scrollbar__wrap {
  overflow-y: hidden;
  height: auto !important;
}

.el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
  height: 100%;
  overflow-y: hidden;
} */

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

/* // .iconfont.icon-searchclose{
//     // width: 20px;
//     // height: 20px;
//     display: inline-block;
//     margin-left: 5px;
//     font-size: 12px;
//     // transform:scale(0.6);
//     // position: relative;
//     border-radius: 50%;
//     // z-index: 5;
// }
// .iconfont.icon-searchclose:hover{
//      background-color: #b4bccc;
//      background-size: 15px 15px;
// }*/
</style>
