<template>
  <div class="basic-layout-tabs__wrapper">
    <ProTabs
      :tabs="tabItems"
      :model-value="getCurrentActivityTabPage?.fullPath || ''"
      :height="layoutConfig.tabBarHeight"
      :font-size="fontSize"
      :draggable="true"
      :show-more-action="true"
      @update:model-value="handleTabClick"
      @tab-close="handleTabRemove"
      @contextmenu="contextmenuHandler"
      @drag-end="handleDragEnd"
    >
      <!-- 更多操作菜单插槽 -->
      <template #more-menu>
        <el-dropdown-item command="reload" @click="reload">
          <el-icon><Refresh /></el-icon> 重新加载
        </el-dropdown-item>
        <el-dropdown-item command="closeOtherstabs" @click="removeOhterTabPages">
          <el-icon><Close /></el-icon> 关闭其他
        </el-dropdown-item>
        <el-dropdown-item command="closeLefttabs" @click="removeLeftAllTabPages">
          <el-icon :style="{ transform: `rotate(-90deg)` }"><Upload /></el-icon> 关闭左侧
        </el-dropdown-item>
        <el-dropdown-item command="closeRighttabs" @click="removeRightAllTabPages">
          <el-icon :style="{ transform: `rotate(90deg)` }"><Upload /></el-icon> 关闭右侧
        </el-dropdown-item>
        <el-dropdown-item command="closeAlltabs" @click="removeAllTabPage">
          <el-icon><CircleClose /></el-icon> 关闭全部
        </el-dropdown-item>
      </template>
    </ProTabs>

    <!-- 右键菜单（保留原逻辑） -->
    <pro-context-menu
      ref="contextRef"
      :menus="getContextMenus('contextmenu')"
      :item-height="25"
      :font-size="12"
      style="width: 80px; font-size: 12px"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'

import { ElIcon } from 'element-plus'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import { useTabPageStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store'
import router from '@/router'
import { Refresh, Close, Upload, CircleClose } from '@element-plus/icons-vue'
import { useReloadPage } from '@/hooks'
import { REDIRECT_NAME } from '@/router/constant'
import { ProContextMenu, type ProContextMenuItem } from '@/components/context-menu'
import { ProTabs, type ProTabItem } from '@/components/pro-tabs'

interface Props {
  fontSize?: number
}

withDefaults(defineProps<Props>(), {
  fontSize: 14
})

const contextRef = ref()
const tabPageStore = useTabPageStore()
const layoutStore = useLayoutStore()
const { layoutConfig } = storeToRefs(layoutStore)

const { reload } = useReloadPage()

const { getTabPages, getCurrentActivityTabPage } = storeToRefs(tabPageStore)

const {
  isAffixTab,
  addTabPage,
  goTabPage,
  removeTabPage,
  reorderTabPages,
  removeAllTabPage,
  removeOhterTabPages,
  removeLeftAllTabPages,
  removeRightAllTabPages
} = tabPageStore

const route = useRoute()
const currentCheckedKey = ref('')

// 禁止删除的 router tag name
const affixTabsList = ref<string[]>([])

// 将 store 的 tabs 转换为 ProTabItem 格式
const tabItems = computed<ProTabItem[]>(() => {
  return getTabPages.value.map(item => ({
    key: item.fullPath,
    label: item.meta?.title || '',
    icon: item.meta?.icon,
    closable: !affixTabsList.value.includes(item.fullPath),
    affix: affixTabsList.value.includes(item.fullPath)
  }))
})

// 拖拽排序结束回调 - 更新 store 中 tabs 顺序
function handleDragEnd(newOrder: string[]) {
  reorderTabPages(newOrder)
}

const getContextMenus = (type: 'operate' | 'contextmenu'): ProContextMenuItem[] => {
  const fullPath =
    type === 'operate' ? getCurrentActivityTabPage.value?.fullPath : currentCheckedKey.value

  const atIndex = getTabPages.value.findIndex(tab => tab.fullPath === fullPath)

  const isCurrentTab =
    type === 'operate'
      ? true
      : getCurrentActivityTabPage.value?.fullPath === currentCheckedKey.value

  const affixTabCount = getTabPages.value.filter(tab => isAffixTab(tab)).length

  const defaultDisabled = affixTabCount === getTabPages.value.length

  return [
    {
      title: '重新加载',
      command: 'reload',
      onClick: reload,
      disabled: !isCurrentTab,
      icon: 'ep.refresh'
    },
    {
      title: '关闭其他',
      command: 'closeOtherstabs',
      icon: 'ep.close',
      onClick: () => {
        removeOhterTabPages()
      },
      disabled: defaultDisabled || !isCurrentTab
    },
    {
      title: '关闭左侧',
      command: 'closeLefttabs',
      onClick: () => {
        removeLeftAllTabPages()
      },
      disabled: !isCurrentTab || atIndex <= affixTabCount,
      icon: () =>
        h(
          ElIcon,
          {
            size: 12,
            style: {
              transform: `rotate(-90deg)`
            }
          },
          () => h(Upload)
        )
    },
    {
      title: '关闭右侧',
      command: 'closeRighttabs',
      onClick: removeRightAllTabPages,
      disabled: !isCurrentTab || atIndex === getTabPages.value.length - 1,
      icon: () =>
        h(
          ElIcon,
          {
            size: 12,
            style: {
              transform: `rotate(90deg)`
            }
          },
          () => h(Upload)
        )
    },
    {
      title: '关闭全部',
      command: 'closeAlltabs',
      onClick: removeAllTabPage,
      disabled: defaultDisabled,
      icon: 'ep.circle-close'
    }
  ]
}

onMounted(() => {
  initAffixTabs()

  watch(
    () => route,
    to => {
      if (to.name === REDIRECT_NAME) return

      const _to = to.matched.find(i => i.name === to.name)

      addTabPage({
        name: to.name as string,
        fullPath: to.fullPath,
        query: to.query,
        params: to.params,
        meta: _to?.meta || {}
      })
    },
    {
      deep: true,
      immediate: true
    }
  )
})

function contextmenuHandler(event: MouseEvent, tab: ProTabItem) {
  currentCheckedKey.value = tab.key as string

  contextRef.value.show(event)
}

function initAffixTabs() {
  function filterAffixTab() {
    return router.getRoutes().filter(route => route.meta.affixTab)
  }

  affixTabsList.value = []

  filterAffixTab().forEach(route => {
    addTabPage({
      name: route.name as string,
      fullPath: route.path,
      query: {},
      params: {},
      meta: route.meta
    })
    affixTabsList.value.push(route.path)
  })
}

function handleTabClick(key: string | number) {
  const route = getTabPages.value.find(t => t.fullPath === key)
  if (route) goTabPage(route)
}

function handleTabRemove(tab: ProTabItem, index: number) {
  removeTabPage(index)
}
</script>
