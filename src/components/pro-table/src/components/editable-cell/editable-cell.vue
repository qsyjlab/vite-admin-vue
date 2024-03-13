<template>
  <component :is="render()" v-if="isNeedRender" />
</template>
<script setup lang="tsx">
import { ElFormItem } from 'element-plus'
import { ProTableColumnItem, ProTableEditRowComponent } from '../../types'
import { h, toRaw, computed, resolveComponent } from 'vue'
import { useTableStoreContext } from '../../store'
import { getRowkey } from '../../utils'

const { editableCellMap, sharedProperties } = useTableStoreContext()

const props = withDefaults(
  defineProps<{
    column: ProTableColumnItem<any>
    value?: any
    row?: any
    rowKey?: any
  }>(),
  {}
)
// const emits = defineEmits<{
//   change: [value: any]
// }>()

const isNeedRender = computed(() => {
  return props.column?.key && props.column.rowComponent && props.column.rowComponent.el
})

function onChangeValue(value: any) {
  const realRowKey = getRowkey(props.row, props.rowKey)
  if (!realRowKey) return
  const row = editableCellMap.value.get(realRowKey)

  if (!row?.data) return
  row.data[props.column.key] = value
}

function getValue() {
  const realRowKey = getRowkey(props.row, props.rowKey)
  if (!realRowKey) return

  const row = editableCellMap.value.get(realRowKey)

  if (!row?.data) return undefined

  return row?.data[props.column.key]
}

function getDynamicComponent(rowComponent: ProTableColumnItem['rowComponent']) {
  if (!rowComponent?.el) return null

  function getDynamicComponentInstance(rowComponent?: ProTableEditRowComponent): any {
    if (!rowComponent) return ''

    const { el } = rowComponent

    if (typeof el === 'string') {
      return resolveComponent(el)
    }

    return toRaw(el)
  }

  const realRowKey = getRowkey(props.row, props.rowKey)

  const enableValidate = sharedProperties.value.enableValidate

  if (enableValidate) {
    return h(
      ElFormItem,
      {
        prop: `${realRowKey}.${props.column.key}`,
        rules: rowComponent.rules
      },
      {
        default: () => renderComponent()
      }
    )
  }

  return renderComponent()

  function renderComponent() {
    return h(getDynamicComponentInstance(rowComponent), {
      ...(rowComponent?.props || {}),
      modelValue: getValue(),
      'onUpdate:modelValue': onChangeValue
    })
  }
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
