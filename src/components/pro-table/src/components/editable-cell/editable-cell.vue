<template>
  <component :is="render()" />
</template>
<script setup lang="tsx">
import { ElInput } from 'element-plus'
import { ProTableColumnItem } from '../../types'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    column?: ProTableColumnItem<any>
    value?: any
  }>(),
  {}
)

const value2 = ref('策划四编辑')

function onChangeValue(value: any) {
  console.log('value')

  value2.value = value
}

function render() {
  return (
    <span
      style={{
        display: 'inline-block'
      }}
    >
      <ElInput modelValue={value2.value} onUpdate:modelValue={onChangeValue} />
    </span>
  )
}
</script>
<style scoped></style>
