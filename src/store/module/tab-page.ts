import router from '@/router'
import { defineStore } from 'pinia'
import { computed, ref, unref } from 'vue'
import type { RouteLocationNormalized, RouteMeta } from 'vue-router'

export interface TabPage {
  name: string
  fullPath: string
  meta: RouteMeta
  query?: Record<string, any>
  params?: Record<string, any>
}

function getRouteToTab(route: RouteLocationNormalized): TabPage {
  return {
    name: route.name as string,
    fullPath: route.fullPath,
    meta: route.meta,
    query: route.query,
    params: route.params
  }
}

export const useTabPageStore = defineStore('tab-page', () => {
  const keepAliveCache = ref<Set<string>>(new Set())

  const tabsList = ref<TabPage[]>([])

  const currentTabPage = ref<TabPage | null>(null)

  const getKeepAliveCache = computed(() => Array.from(keepAliveCache.value))

  const getTabPages = computed(() => tabsList.value)

  const getCurrentActivityTabPage = computed(() => currentTabPage.value)

  function addTabPage(route: RouteLocationNormalized) {
    const _route = getRouteToTab(route)

    const tabsRaw = unref(tabsList)

    if (tabsRaw.length === 0) {
      tabsRaw.push(_route)
    } else {
      const sameRouter = tabsRaw.find(
        item => item.name === _route.name && item.fullPath === _route.fullPath
      )
      if (!sameRouter) {
        tabsRaw.push(_route)
      }
    }

    updateTabCache()
    goTabPage(_route)
  }

  function updateTabPage(newTab: TabPage, tab?: TabPage) {
    const targetTab = tab || currentTabPage.value

    if (!targetTab) return

    const findTab = getTabPages.value.find(item => targetTab.fullPath === item.fullPath)
    if (findTab) {
      findTab.meta.title = newTab.meta.title
      updateTabCache()
    }
  }

  function removeTabPage(index: number) {
    tabsList.value.splice(index, 1)
    updateTabCache()

    const lastIndex = tabsList.value.length - 1
    if (lastIndex < 0) return

    currentTabPage.value = tabsList.value[lastIndex]
    goTabPage(currentTabPage.value)
  }

  function removeAllTabPage() {
    resetTabPages()
    currentTabPage.value = null
    updateTabCache()
  }

  function removeOhterTabPages() {
    resetTabPages()

    if (currentTabPage.value) {
      tabsList.value.push(currentTabPage.value)
    }
  }

  function removeLeftAllTabPages() {
    let atIndex = tabsList.value.findIndex(i => i.fullPath === currentTabPage.value?.fullPath)

    if (atIndex === -1) return

    for (let i = 0; i < atIndex; i++) {
      // const item = tabsList.value[i]

      // if (isAffixTab(item.name)) continue
      tabsList.value.splice(i, 1)
      i--
      atIndex--
    }
  }

  function removeRightAllTabPages() {
    if (!tabsList.value.length) return
    const atIndex = tabsList.value.findIndex(i => i.fullPath === currentTabPage.value?.fullPath)

    if (atIndex === -1) return

    for (let i = tabsList.value.length - 1; i > atIndex; i--) {
      tabsList.value.splice(i, 1)
    }
  }
  function resetTabPages() {
    // TODO: 后续需要处理 固定的标签页
    tabsList.value = []
  }

  function goTabPage(tab: TabPage) {
    router.push({ path: tab.fullPath })
    currentTabPage.value = tab
  }

  function updateTabCache() {
    const cacheNames = tabsList.value.filter(i => i.meta.ignoreKeepAlive).map(i => i.name)

    keepAliveCache.value.clear()
    cacheNames.forEach(name => {
      keepAliveCache.value.add(name)
    })
  }

  return {
    addTabPage,
    removeTabPage,
    removeAllTabPage,
    removeOhterTabPages,
    removeLeftAllTabPages,
    removeRightAllTabPages,
    updateTabPage,
    goTabPage,
    getTabPages,
    getKeepAliveCache,
    getCurrentActivityTabPage
  }
})
