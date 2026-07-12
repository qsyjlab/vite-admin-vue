<template>
  <el-tree-select
    v-model="value"
    :data="data"
    :props="treeProps"
    :node-key="nodeKey"
    :multiple="multiple"
    :check-strictly="checkStrictly"
    :render-after-expand="false"
    filterable
    clearable
    v-bind="$attrs"
  />
</template>

<script setup lang="ts" generic="TNode extends object = Record<string, unknown>">
import { computed } from 'vue'
import { ElTreeSelect } from 'element-plus'
import type { ProTreeFields } from './pro-tree'

defineOptions({ name: 'ProTreeSelect', inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    modelValue?: string | number | Array<string | number>
    data?: TNode[]
    fields?: Partial<ProTreeFields<TNode>>
    nodeKey?: string
    multiple?: boolean
    checkStrictly?: boolean
  }>(),
  { data: () => [], fields: () => ({}), nodeKey: 'id', multiple: false, checkStrictly: false }
)
const emit = defineEmits<{
  'update:model-value': [value: string | number | Array<string | number> | undefined]
  change: [value: string | number | Array<string | number> | undefined]
}>()
const value = computed({
  get: () => props.modelValue,
  set: next => {
    emit('update:model-value', next)
    emit('change', next)
  }
})
const treeProps = computed(() => ({
  value: String(props.fields.key ?? props.nodeKey),
  label: String(props.fields.label ?? 'label'),
  children: String(props.fields.children ?? 'children'),
  disabled: String(props.fields.disabled ?? 'disabled')
}))
</script>
