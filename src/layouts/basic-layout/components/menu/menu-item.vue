<template>
  <el-menu-item v-if="!hasChildrenMenu(item)" :index="item.name" :route="{ name: item.name }">
    <div v-if="item.meta?.icon" class="icon">
      <IconSelector :size="16" :icon="item.meta?.icon" />
    </div>
    <template #title>
      <span>{{ item?.meta?.title }}</span></template
    >
  </el-menu-item>

  <el-sub-menu v-else :index="item.name">
    <template #title>
      <div v-if="item.meta?.icon" class="icon">
        <IconSelector :size="16" :icon="item.meta?.icon" />
      </div>
      <span>{{ item?.meta?.title }}</span>
    </template>

    <template v-for="childMenu in item.children" :key="childMenu.name">
      <el-menu-item
        v-if="!childMenu.children?.length"
        :index="childMenu.name"
        :route="{ name: childMenu.name }"
      >
        <div v-if="childMenu.meta?.icon" class="icon">
          <IconSelector :size="16" :icon="childMenu.meta?.icon" />
        </div>

        <template #title>
          {{ childMenu?.meta?.title }}
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
import { IconSelector } from '@/components/icon'
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
  width: 24px;
  margin-right: 5px;
}
</style>
