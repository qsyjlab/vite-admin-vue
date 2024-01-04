<template>
  <el-menu-item
    v-if="!hasChildrenMenu(menu)"
    :style="{
      '--el-menu-item-height': `${itemHeight}px`
    }"
    :disabled="menu.disabled"
    :index="menu.command"
  >
    <div class="menu-item" @mousedown.stop="clickMenuItem(menu.command, menu)">
      <div v-if="menu?.icon" class="icon">
        <ProIcon :size="fontSize" :icon="menu?.icon" />
      </div>
      <span class="ellipsis">{{ menu?.title }}</span>
    </div>
  </el-menu-item>

  <el-sub-menu v-else :index="menu.command">
    <template #title>
      <div v-if="menu?.icon" class="icon">
        <ProIcon :size="fontSize" :icon="menu?.icon" />
      </div>
      <span class="ellipsis">{{ menu?.title }}</span>
    </template>

    <template v-for="childMenu in menu.children" :key="childMenu.command">
      <el-menu-item
        v-if="!childMenu.children?.length"
        :style="{
          '--el-menu-item-height': `${itemHeight}px`
        }"
        :disabled="menu.disabled"
        :index="childMenu.command"
      >
        <div v-if="childMenu?.icon" class="icon">
          <ProIcon :size="fontSize" :icon="childMenu?.icon" />
        </div>

        <div @mousedown.stop="clickMenuItem(childMenu.command, childMenu)">
          <span class="ellipsis">{{ childMenu?.title }}</span>
        </div>
      </el-menu-item>

      <menu-item v-else :menu="childMenu"></menu-item>
    </template>
  </el-sub-menu>
</template>

<script setup lang="ts">
import type { ProContextMenuItem } from './types'
import { inject } from 'vue'
import { contextMenuKey } from './context-menu'
import { ProIcon } from '@/components/icon'

interface IProps {
  menu: ProContextMenuItem
}

defineProps<IProps>()

const { onClick, itemHeight, fontSize } = inject(contextMenuKey) || {}

const hasChildrenMenu = (menu: ProContextMenuItem) => {
  return !!menu.children?.length
}

const clickMenuItem = (command: ProContextMenuItem['command'], menu: ProContextMenuItem) => {
  if (menu.disabled) return
  menu.onClick?.()
  onClick?.(command, menu)
}
</script>

<style lang="scss" scoped>
.menu-item {
  width: 100%;
  display: flex;
}
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  margin: 0;
  vertical-align: middle;
  width: var(--el-menu-icon-width);
  text-align: center;
  flex-shrink: 0;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
</style>
