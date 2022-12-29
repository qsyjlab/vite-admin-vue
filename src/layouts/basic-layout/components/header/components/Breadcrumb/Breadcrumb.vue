<template>
  <el-breadcrumb :separator="'/'">
    <transition-group name="breadcrumb" appear>
      <el-breadcrumb-item
        v-for="(item, index) in breadCrumbList"
        :key="index"
        :to="{ name: item.name }"
        >{{ item?.meta?.title }}</el-breadcrumb-item
      >
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue'
import type { RouteMeta } from 'vue-router'
import { useRouteStore } from '@/store'
import { useRouterHelper } from '@/hooks'

interface BreadcrumbItem {
  name: string
  meta?: RouteMeta
}

const routeStore = useRouteStore()
const { currentRoute, currentModule } = useRouterHelper()

const breadCrumbList = computed(() => {
  const current = unref(currentRoute)
  const module = unref(currentModule)

  if (!current.name) return []

  const mapping = routeStore.routeMapping[module.name as string]

  const relation = mapping.originRoutesRelation

  function traverse(name: string, matched: BreadcrumbItem[]) {
    const cur = relation[name]
    if (!cur || !cur.name) return matched

    matched?.unshift({
      name: cur.name,
      meta: cur.meta
    })
    if (cur.parentName) {
      traverse(cur.parentName, matched)
    }

    return matched
  }

  return traverse(current.name as string, [])
})
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
