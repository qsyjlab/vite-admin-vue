<template>
  <component v-if="isNeedRender" :is="render()" />
</template>
<script setup lang="tsx">
import { ElPopover } from 'element-plus'
import { ProTableColumnItem, ProTableEditRowComponent } from '../../types'
import { h, toRaw, computed, resolveComponent } from 'vue'
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

const isNeedRender = computed(() => {
  return props.column?.key && props.column.rowComponent && props.column.rowComponent.el
})

function onChangeValue(value: any) {
  emits('change', value)
}

function getValue() {
  if (!props.column?.key) return undefined

  return props.row[props.column?.key]
}

function getDynamicComponent(rowComponent: ProTableColumnItem['rowComponent']) {
  if (!rowComponent?.el) return null

  function getDynamicComponentInstance(rowComponent?: ProTableEditRowComponent): any {
    if (!rowComponent) return ''

    const { el } = rowComponent

    if (typeof el === 'string') {
      return resolveComponent(el)
    }

    console.log('toRaw(el)', toRaw(el))

    return toRaw(el)
  }

  return h(
    ElPopover,
    {
      placement: 'top',
      popperStyle: {
        // zIndex: 1
      },
      visible: false
    },
    {
      default: () => '错误文本提示',
      reference: () =>
        h(
          'span',
          {},
          h(getDynamicComponentInstance(rowComponent), {
            ...(rowComponent.props || {}),
            modelValue: getValue(),
            'onUpdate:modelValue': onChangeValue
          })
        )
    }
  )
}

function render() {
  const { column } = props
  if (!column) return <></>
  const { rowComponent } = column

  if (!rowComponent) return <></>
  return <span>{getDynamicComponent(rowComponent)}</span>
}
</script>
<style scoped></style>
