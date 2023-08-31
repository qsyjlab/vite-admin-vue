<template>
  <div>
    <el-popover placement="bottom" :width="300" trigger="click" :show-arrow="false">
      <template #reference>
        <el-badge is-dot>
          <slot></slot>
        </el-badge>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="通知" name="1"></el-tab-pane>
        <el-tab-pane label="消息" name="2"></el-tab-pane>
        <el-tab-pane label="代办" name="3"></el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

defineSlots<{
  default: NOOP
}>()

const activeName = ref<string>('1')
</script>
<style scoped></style>
