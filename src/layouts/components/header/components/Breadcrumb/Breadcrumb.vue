<template>
  <el-breadcrumb :separator="'/'">
    <transition-group name="breadcrumb" appear>
      <el-breadcrumb-item
        v-for="(item, index) in breadCrumbList"
        :key="index"
        :to="{ path: item.path }"
        >{{ item?.meta?.title }}</el-breadcrumb-item
      >
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import type { RouteLocationMatched, RouteMeta } from 'vue-router'

interface ReactiveTypes {
  breadCrumbList: {
    name: string
    path: string
    meta: RouteMeta
  }[]
}

const route = useRoute()

const state = reactive<ReactiveTypes>({
  breadCrumbList: []
})

const { breadCrumbList } = toRefs(state)

onMounted(() => {
  getRouteBread(route?.matched)
})

onBeforeRouteUpdate(to => {
  getRouteBread(to?.matched)
})

const getRouteBread = (matched: RouteLocationMatched[]) => {
  state.breadCrumbList = matched
    .filter(item => !item.meta.hideInBreadcrumb)
    .map(item => ({
      path: item.path as string,
      name: item.name as string,
      meta: item.meta
    }))
}
</script>

<style scoped>
/* breadcrumb transition */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all 0.5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
