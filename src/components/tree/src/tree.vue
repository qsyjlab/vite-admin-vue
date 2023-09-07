<template>
  <el-tree
    ref="treeRef"
    :data="data"
    :show-checkbox="showCheckbox"
    default-expand-all
    :highlight-current="highlightCurrent"
    :node-key="nodeKey"
    :props="treeProps"
    @current-change="curretChange"
    @check="check"
  />

  <!-- <div class="buttons">
    <el-button @click="getCheckedNodes">get by node</el-button>
    <el-button @click="getCheckedKeys">get by key</el-button>
    <el-button @click="setCheckedNodes">set by node</el-button>
    <el-button @click="setCheckedKeys">set by key</el-button>
    <el-button @click="resetChecked">reset</el-button>
  </div> -->
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { ElTree } from 'element-plus'

import type { TreeInstance, TreeProps } from './types'
import { watch } from 'vue'

const emits = defineEmits<{
  'update:model-value': [val: any]
  check: any[]
}>()

const props = withDefaults(
  defineProps<{
    modelValue?: any
    data: TreeInstance['data']
    treeProps?: TreeProps
    nodeKey?: TreeInstance['nodeKey']
    highlightCurrent?: TreeInstance['highlightCurrent']
    showCheckbox?: TreeInstance['showCheckbox']
  }>(),
  {
    nodeKey: 'id',
    highlightCurrent: true,
    showCheckbox: true
  }
)

const treeRef = ref<TreeInstance>()

const keys = ref<any>()

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return
    keys.value = newVal
    nextTick(() => {
      setTreeKeys()
    })
  },
  {
    immediate: true
  }
)

const curretChange: TreeInstance['onCurrent-change'] = () => {
  if (props.showCheckbox) return

  updateModelValue()
}

const check: TreeInstance['onCheck'] = () => {
  updateModelValue()
}

function setTreeKeys() {
  if (props.showCheckbox) {
    treeRef.value?.setCheckedKeys(keys.value)
  } else {
    treeRef.value?.setCurrentKey(keys.value)
  }
}

function updateModelValue() {
  if (props.showCheckbox) {
    keys.value = treeRef.value?.getCheckedKeys()
  } else {
    keys.value = treeRef.value?.getCurrentKey()
  }
  emits('update:model-value', keys.value)
}

defineExpose({
  treeInstance: treeRef.value
})
</script>
