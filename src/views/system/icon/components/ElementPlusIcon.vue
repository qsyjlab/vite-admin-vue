<!--
 * @Description: @element-plus/icons-vue
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-23 22:20:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-08-01 09:54:27
 * @FilePath: \vite-admin-vue\src\views\system\icon\components\ElementPlusIcon.vue
-->

<template>
  <div class="grid">
    <icon-trigger
      v-for="(item, index) in iconList"
      :key="index"
      class="grid-item"
      :item="{ name: 'Icon' + item.name, com: renderIcon('Icon' + item.name, item.com) }"
      >{{ item.name }}</icon-trigger
    >
  </div>
</template>

<script lang="ts">
export default { name: 'ElementPlusIcon' }
</script>

<script setup lang="ts">
import IconTrigger from './IconTrigger.vue'
import * as icons from '@/plugins/elementPlusIcon/icon'
import { Component, ref, markRaw } from 'vue'

import { renderIcon } from '@/plugins/elementPlusIcon'

const iconList = ref<{ name: string; com: Component }[]>([])

Object.keys(icons as any).forEach((item: string) => {
  iconList.value.push({
    name: icons[item as keyof typeof icons].name as string,
    com: markRaw(icons[item as keyof typeof icons]) as Component
  })
})
</script>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}
</style>
