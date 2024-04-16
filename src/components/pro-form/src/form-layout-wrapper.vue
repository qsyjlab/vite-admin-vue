<template>
  <el-row v-if="layout" v-bind="$attrs">
    <slot></slot>
  </el-row>

  <slot v-else></slot>
</template>
<script setup lang="ts">
import { ElRow } from 'element-plus'

defineOptions({
  inheritAttrs: false
})

withDefaults(
  defineProps<{
    layout: boolean
  }>(),
  {
    layout: true
  }
)
</script>
