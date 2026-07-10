<template>
  <el-menu-item v-if="!hasChildrenMenu(item)" :index="item.name" :route="{ name: item.name }">
    <div v-if="item.meta?.icon" class="icon">
      <ProIcon :size="18" :icon="item.meta?.icon" />
    </div>
    <div v-else class="icon fallback-icon">
      <ProIcon :size="18" icon="ep.document" />
    </div>
    <template #title>
      <span class="ellipsis">{{ item?.meta?.title }}</span></template
    >
  </el-menu-item>

  <el-sub-menu v-else :index="item.name">
    <template #title>
      <div v-if="item.meta?.icon" class="icon">
        <ProIcon :size="18" :icon="item.meta?.icon" />
      </div>
      <div v-else class="icon fallback-icon">
        <ProIcon :size="18" icon="ep.folder-opened" />
      </div>

      <span class="ellipsis">{{ item?.meta?.title }}</span>
    </template>

    <template v-for="childMenu in item.children" :key="childMenu.name">
      <el-menu-item
        v-if="!childMenu.children?.length"
        :index="childMenu.name"
        :route="{ name: childMenu.name }"
      >
        <div v-if="childMenu.meta?.icon" class="icon">
          <ProIcon :size="18" :icon="childMenu.meta?.icon" />
        </div>
        <div v-else class="icon fallback-icon">
          <ProIcon :size="18" icon="ep.document" />
        </div>

        <template #title>
          <span class="ellipsis">{{ childMenu?.meta?.title }}</span>
        </template>
      </el-menu-item>

      <menu-item v-else :item="childMenu" :mode="mode"></menu-item>
    </template>
  </el-sub-menu>
</template>

<script setup lang="ts">
import { ProIcon } from '@/components/icon'
import type { Menu } from '@/router/types'

interface IProps {
  item: Menu
  mode: 'horizontal' | 'vertical'
}

defineOptions({
  name: 'MenuItem'
})
defineProps<IProps>()

const hasChildrenMenu = (item: Menu) => {
  return !item.meta?.hideChildrenInMenu && !!item.children?.length
}
</script>

<style lang="scss" scoped>
/* 图标容器 - 固定尺寸，确保对齐 */
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  position: relative;

  /* 确保内部内容居中 */
  :deep(svg),
  :deep(.pro-icon),
  :deep(i) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :deep(.el-icon) {
    width: 18px;
    height: 18px;
    margin: 0 !important;
    flex: 0 0 18px;
    line-height: 1;
  }

  :deep(.pro-icon) {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);
  }

  :deep(svg) {
    display: block;
    width: 18px;
    height: 18px;
  }
}

.fallback-icon {
  color: var(--global-text-color-secondary);
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
</style>
