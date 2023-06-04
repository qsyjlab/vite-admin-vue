<template>
  <el-breadcrumb :separator="'/'">
    <transition-group name="breadcrumb" appear>
      <el-breadcrumb-item
        v-for="item in breadCrumbList"
        :key="item.name"
        :to="{ name: item.name }"
        >{{ item?.meta?.title }}</el-breadcrumb-item
      >
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteMeta } from 'vue-router'
import { useRouteStore } from '@/store'
import { useRouterHelper } from '@/hooks'
import { getMenus } from '@/router/menus'

interface BreadcrumbItem {
  name: string
  meta?: RouteMeta
}

const routeStore = useRouteStore()
const { currentRoute } = useRouter()
// const { currentRoute, currentModule } = useRouterHelper()

const breadCrumbList = computed(() => {
  const current = unref(currentRoute)

  const menus = getMenus()

  // console.log('menus', menus)
  const routeMatched = currentRoute.value.matched
  const currentMatched = routeMatched?.[routeMatched.length - 1]
  let path = currentRoute.value.path

  console.log('menus', menus)

  const parent = getAllParentPath(menus, path)

  const filterMenus = menus.filter(item => item.path === parent[0])
  const matched = getMatched(filterMenus, parent) as any

  return matched.filter(i => !i.meta.hideBreadcrumb)
})

// function filterItem(list: RouteLocationMatched[]) {
//   return filter(list, item => {
//     const { meta, name } = item
//     if (!meta) {
//       return !!name
//     }
//     const { title, hideBreadcrumb, hideMenu } = meta
//     if (!title || hideBreadcrumb || hideMenu) {
//       return false
//     }
//     return true
//   }).filter(item => !item.meta?.hideBreadcrumb)
// }

function getAllParentPath<T = any>(treeData: T[], path: string) {
  const menuList = findPath(treeData, n => n.path === path)

  console.log('menuList', menuList)

  return (menuList || []).map(item => item.path)
}

function findPath<T = any>(tree: any, func: any): T | T[] | null {
  const config = {
    children: 'children'
  }
  const path: T[] = []
  const list = [...tree]
  const visitedSet = new Set()
  const { children } = config
  while (list.length) {
    const node = list[0]

    console.log('node', node)

    if (visitedSet.has(node)) {
      path.pop()
      list.shift()
    } else {
      visitedSet.add(node)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      node[children!] && list.unshift(...node[children!])
      path.push(node)
      if (func(node)) {
        return path
      }
    }
  }
  return null
}

function getMatched(menus: any[], parent: string[]) {
  const metched: any[] = []
  menus.forEach(item => {
    if (parent.includes(item.path)) {
      metched.push({
        ...item,
        name: item.meta?.title || item.name
      })
    }
    if (item.children?.length) {
      metched.push(...getMatched(item.children, parent))
    }
  })
  return metched
}
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
