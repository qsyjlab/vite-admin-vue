import router from '@/router'
import { defineStore } from 'pinia'
import { computed, ref, unref } from 'vue'
import projectSetting from '@/config/project-setting'

import type { RouteMeta } from 'vue-router'

export interface TabPage {
  name: string
  fullPath: string
  meta: RouteMeta
  query?: Record<string, any>
  params?: Record<string, any>
}

// 是否是需要固定的 tab 栏
function isAffixTab(tab: TabPage) {
  return tab.meta.affixTab
}

function getRouteToTab(route: TabPage): TabPage {
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

  const affixTabsList = ref<string[]>([])

  const getKeepAliveCache = computed(() => Array.from(keepAliveCache.value))

  const getTabPages = computed(() => tabsList.value)

  const getCurrentActivityTabPage = computed(() => currentTabPage.value)

  const getAffixTabsList = computed(() => affixTabsList.value)

  function addTabPage(route: TabPage) {
    // 如果 隐藏项 则不添加
    if (route.meta.hideInTab) return

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
    currentTabPage.value = _route
    // goTabPage(_route)
  }

  /**
   * 更新 tab-page 成员信息 不要外部暴露使用
   * 外部 hook 抽离并包装成 外部方法
   * @example
   * 更新 tab 标题 setTitle: (title, tartget?: = currentTab) =>  updateTabPage({meta:title, target})
   *
   */
  function updateTabPage(newTab: Partial<TabPage>, tab?: TabPage) {
    const targetTab = tab || currentTabPage.value

    if (!targetTab) return

    const findTab = getTabPages.value.find(item => targetTab.fullPath === item.fullPath)
    if (findTab) {
      findTab.meta.title = newTab.meta?.title
      updateTabCache()
    }
  }

  function removeTabPage(index: number) {
    const waitRemoveItem = tabsList.value[index]

    if (waitRemoveItem.meta.affixTab) return

    tabsList.value.splice(index, 1)
    updateTabCache()
    goLastTabRoute()
  }

  function removeAllTabPage() {
    resetTabPages()
    currentTabPage.value = null
    updateTabCache()
    goLastTabRoute()
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
      if (isAffixTab(tabsList.value[i])) continue
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
      if (isAffixTab(tabsList.value[i])) continue
      tabsList.value.splice(i, 1)
    }
  }
  function resetTabPages() {
    tabsList.value = tabsList.value.filter(i => i.meta.affixTab)
  }

  function goTabPage(tab: TabPage) {
    router.push({ path: tab.fullPath })
    currentTabPage.value = tab
  }

  function updateTabCache() {
    if (projectSetting.keepAliveCachePolicy !== 'tab') return
    const cacheNames = tabsList.value.filter(i => i.meta.ignoreKeepAlive).map(i => i.name)

    keepAliveCache.value.clear()
    cacheNames.forEach(name => {
      addKeepAlive(name)
    })
  }

  function addKeepAlive(name: string) {
    keepAliveCache.value.add(name)
  }

  // 跳转到最后一个 tab
  function goLastTabRoute() {
    const lastIndex = tabsList.value.length - 1
    if (lastIndex < 0) return

    currentTabPage.value = tabsList.value[lastIndex]
    goTabPage(currentTabPage.value)
  }

  return {
    addTabPage,
    removeTabPage,
    removeAllTabPage,
    removeOhterTabPages,
    removeLeftAllTabPages,
    removeRightAllTabPages,
    updateTabPage,
    addKeepAlive,
    goTabPage,
    getTabPages,
    getAffixTabsList,
    getKeepAliveCache,
    getCurrentActivityTabPage
  }
})
