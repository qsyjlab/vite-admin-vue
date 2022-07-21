<!--
 * @Description:基于elementplus 封装 checkbox
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-01-07 10:11:59
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-21 09:36:32
-->
<template>
  <el-checkbox-group v-model="checked" v-bind="{ ...$attrs, size }" @change="handleCheckChange">
    <component
      :is="buttonStyle ? 'el-checkbox-button' : 'el-checkbox'"
      v-for="item in options"
      :key="item?.key || item.value"
      :label="item.value"
      v-bind="{ size, ...item.attrs }"
    >
      {{ item.label }}</component
    >
  </el-checkbox-group>
</template>
<script lang="ts">
export default {
  name: 'QsCheckboxGroup'
}
</script>

<script setup lang="ts">
import type { GlobalSize } from '../common'
import type { OptionsType } from './checkbox-group'

import { ref, watch } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  // 选项
  options: {
    type: Array as PropType<OptionsType[]>,
    default: () => []
  },
  // 是否按钮样式
  buttonStyle: {
    type: Boolean,
    default: false
  },
  // 大小
  size: {
    type: String as PropType<GlobalSize>,
    validator: (value: string) => {
      return ['large', 'default', 'small'].includes(value)
    },
    default: 'default'
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void
}>()

const checked = ref<any[]>([])

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (JSON.stringify(oldVal) === JSON.stringify(newVal)) return

    checked.value = newVal
  }
)

const handleCheckChange = (e: any[]): void => {
  emit('update:modelValue', e)
}
</script>

<style scoped></style>
