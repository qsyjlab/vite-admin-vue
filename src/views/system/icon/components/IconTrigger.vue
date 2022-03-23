<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-23 21:51:13
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-23 23:22:14
 * @FilePath: \vite-admin-vue\src\views\system\icon\components\IconTrigger.vue
-->

<template>
  <el-tooltip effect="dark" content="Top Left prompts info" placement="top-start">
    <div class="icon-item">
      <div class="icon-main">
        <component :is="item"></component>
      </div>

      <div class="icon-desc"><slot></slot></div>
    </div>
  </el-tooltip>
</template>
<script setup lang="ts">
interface Props {
  item: any
}

const props = withDefaults(defineProps<Props>(), {})
</script>
<style scoped>
.icon-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.icon-main {
  margin-bottom: 7px;
}
.icon-desc {
  font-size: 14px;
}
</style>
