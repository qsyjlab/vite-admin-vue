<!--
 * @Description: @element-plus/icons-vue
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-23 22:20:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-23 23:19:35
 * @FilePath: \vite-admin-vue\src\views\system\icon\components\ElementPlusIcon.vue
-->

<template>
  <div class="grid">
    <icon-trigger
      v-for="(item, index) in iconList"
      :key="index"
      class="grid-item"
      :item="renderIcon('Icon' + item.name, item.com)"
      >{{ item.name }}</icon-trigger
    >
  </div>
</template>
<script setup lang="ts">
import IconTrigger from './IconTrigger.vue'
import * as icons from '@/plugins/elementPlusIcon/icon'
import { Component, ref, markRaw } from 'vue'

import { renderIcon } from '@/plugins/elementPlusIcon'

const iconList = ref<{ name: string; com: Component }[]>([])

Object.keys(icons).forEach(item => {
  iconList.value.push({ name: icons[item].name, com: markRaw(icons[item]) })
})
</script>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}
</style>
