<template>
  <el-menu-item v-if="!hasChildrenMenu(item)" :index="item.name" :route="{ name: item.name }">
    <div v-if="item.meta?.icon" class="icon">
      <ProIcon :size="18" :icon="item.meta?.icon" />
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

        <template #title>
          <span class="ellipsis">{{ childMenu?.meta?.title }}</span>
        </template>
      </el-menu-item>

      <menu-item v-else :item="childMenu"></menu-item>
    </template>
  </el-sub-menu>
</template>

<script lang="ts">
export default {
  name: 'MenuItem'
}
</script>

<script setup lang="ts">
import { ProIcon } from '@/components/icon'
import type { Menu } from '@/router/types'

interface IProps {
  item: Menu
}

defineProps<IProps>()

const hasChildrenMenu = (item: Menu) => {
  return !item.meta?.hideChildrenInMenu && !!item.children?.length
}
</script>

<style lang="scss" scoped>
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
