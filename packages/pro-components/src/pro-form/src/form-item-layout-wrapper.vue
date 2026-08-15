<template>
  <el-col v-if="layout" v-bind="$attrs">
    <slot></slot>
  </el-col>

  <div v-else class="pro-form-item-layout-wrapper">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { ElCol } from 'element-plus'

defineOptions({
  inheritAttrs: false
})

withDefaults(
  defineProps<{
    layout?: boolean
  }>(),
  {
    layout: true
  }
)
</script>
