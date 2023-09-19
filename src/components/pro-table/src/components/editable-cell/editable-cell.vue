<template>
  <component :is="render()" />
</template>
<script setup lang="tsx">
import { ElInput } from 'element-plus'
import { ProTableColumnItem } from '../../types'

const props = withDefaults(
  defineProps<{
    column?: ProTableColumnItem<any>
    value?: any
    row?: any
  }>(),
  {}
)
const emits = defineEmits<{
  change: [value: any]
}>()

function onChangeValue(value: any) {
  emits('change', value)
}

function getValue() {
  if (!props.column?.key) return undefined

  return props.row[props.column?.key]
}

function render() {
  return (
    <span
      style={{
        display: 'inline-block'
      }}
    >
      <ElInput modelValue={getValue()} onUpdate:modelValue={onChangeValue} />
    </span>
  )
}
</script>
<style scoped></style>
