<template>
  <el-menu-item v-if="!hasChildrenMenu(menu)" :index="menu.command">
    <div class="menu-item" @mousedown.stop="clickMenuItem(menu.command, menu)">
      <div v-if="menu?.icon" class="icon">
        <IconSelector :size="18" :icon="menu?.icon" />
      </div>
      <span class="ellipsis">{{ menu?.title }}</span>
    </div>
  </el-menu-item>

  <el-sub-menu v-else :index="menu.command">
    <template #title>
      <div v-if="menu?.icon" class="icon">
        <IconSelector :size="18" :icon="menu?.icon" />
      </div>
      <span class="ellipsis">{{ menu?.title }}</span>
    </template>

    <template v-for="childMenu in menu.children" :key="childMenu.command">
      <el-menu-item v-if="!childMenu.children?.length" :index="childMenu.command">
        <div @mousedown.stop="clickMenuItem(childMenu.command, childMenu)">
          <div v-if="childMenu?.icon" class="icon">
            <IconSelector :size="18" :icon="childMenu?.icon" />
          </div>

          <span class="ellipsis">{{ childMenu?.title }}</span>
        </div>
      </el-menu-item>

      <menu-item v-else :menu="childMenu"></menu-item>
    </template>
  </el-sub-menu>
</template>

<script setup lang="ts">
import { IconSelector } from '@/components/icon'
import type { ProContextMenuItem } from './types'
import { inject } from 'vue'
import { contextMenuKey } from './context-menu'

interface IProps {
  menu: ProContextMenuItem
}

defineProps<IProps>()

const { onClick } = inject(contextMenuKey) || {}

const hasChildrenMenu = (menu: ProContextMenuItem) => {
  return !!menu.children?.length
}

const clickMenuItem = (command: ProContextMenuItem['command'], menu: ProContextMenuItem) => {
  menu.onClick?.()
  onClick?.(command, menu)
}
</script>

<style lang="scss" scoped>
.menu-item {
  width: 100%;
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
