<template>
  <el-breadcrumb :separator="'/'">
    <el-breadcrumb-item v-for="item in matched" :key="item.path" :to="{ name: item.name }">
      <div class="breadcrumb-item">
        <div v-if="projectSetting.defaultLayoutSetting.showBreadCrumbIcon" class="icon">
          <ProIcon :icon="item.meta.icon" :size="18" />
        </div>
        <div class="title">{{ item?.meta?.title }}</div>
      </div>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { RouteRecordNormalized } from 'vue-router'
import { routeChangeListener } from '@/router'
import { REDIRECT_NAME } from '@/router/constant'
import { ProIcon } from '@/components/icon'
import projectSetting from '@/config/project-setting'

const matched = ref<RouteRecordNormalized[]>([])

const stopListener = routeChangeListener((to, from, _matched) => {
  if (to.name === REDIRECT_NAME) return
  matched.value = _matched.filter(i => i.meta.hideInBreadcrumb !== true)
})

onUnmounted(() => {
  stopListener()
})
</script>

<style lang="scss" scoped>
.breadcrumb-item {
  display: flex;
  align-items: center;
  height: 18px;
  .icon {
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

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
