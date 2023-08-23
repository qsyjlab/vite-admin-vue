<template>
  <el-breadcrumb :separator="'/'">
    <el-breadcrumb-item v-for="item in matched" :key="item.path" :to="{ name: item.name }">{{
      item?.meta?.title
    }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { RouteRecordNormalized } from 'vue-router'
import { routeChangeListener } from '@/router'
import { REDIRECT_NAME } from '@/router/constant'

const matched = ref<RouteRecordNormalized[]>([])

const stopListener = routeChangeListener((to, from, _matched) => {
  if (to.name === REDIRECT_NAME) return
  matched.value = _matched
})

onUnmounted(() => {
  stopListener()
})
</script>

<style lang="scss" scoped>
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
