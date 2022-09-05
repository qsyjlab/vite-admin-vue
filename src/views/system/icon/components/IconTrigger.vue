<template>
  <el-tooltip effect="dark" :content="item.name" placement="top-start">
    <div class="icon-item">
      <div class="icon-main">
        <component :is="item.com"></component>
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
