<template>
  <el-breadcrumb :separator="'/'">
    <el-breadcrumb-item v-for="item in breadCrumbList" :key="item.path" :to="{ name: item.name }">{{
      item?.meta?.title
    }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getMenus } from '@/router/menus'

const { currentRoute } = useRouter()
const breadCrumbList = computed(() => {
  const menus = getMenus()

  let path = currentRoute.value.path

  const parent = getAllParentPath(menus, path)

  const filterMenus = menus.filter(item => item.path === parent[0])
  const matched = getMatched(filterMenus, parent) as any
  return matched.filter((i: any) => !i.meta.hideBreadcrumb)
})

function getAllParentPath<T = any>(treeData: T[], path: string) {
  const menuList = findPath(treeData, (n: any) => n.path === path)

  return (menuList || []).map((item: any) => item.path)
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
        name: item.name
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
