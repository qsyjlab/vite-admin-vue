<template>
  <el-menu-item
    v-if="!hasChildrenMenu(menuItem)"
    :index="menuItem.name"
    :route="{ name: menuItem.name }"
  >
    <div v-if="menuItem.meta?.icon" class="icon">
      <IconSelector :size="16" :icon="menuItem.meta?.icon" />
    </div>
    <template #title>
      <span>{{ menuItem?.meta?.title }}</span></template
    >
  </el-menu-item>

  <el-sub-menu v-else :index="menuItem.name">
    <template #title>
      <div v-if="menuItem.meta?.icon" class="icon">
        <IconSelector :size="16" :icon="menuItem.meta?.icon" />
      </div>
      <span>{{ menuItem?.meta?.title }}</span>
    </template>

    <template v-for="childMenu in menuItem.children" :key="childMenu.name">
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

      <menu-item v-else :menu-item="childMenu"></menu-item>
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
interface IProps {
  menuItem: any
}

defineProps<IProps>()

const hasChildrenMenu = (item: any) => {
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
