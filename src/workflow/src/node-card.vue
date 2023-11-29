<template>
  <div
    v-if="
      [
        NodeTypeEnum.Initiator,
        NodeTypeEnum.Approver,
        NodeTypeEnum.CC,
        NodeTypeEnum.Delay,
        NodeTypeEnum.Trigger,
        NodeTypeEnum.Processor
      ].includes(nodeConfig.type)
    "
    class="node-wrap"
  >
    <div
      class="node-wrap-box"
      :class="
        (nodeConfig.type === NodeTypeEnum.Initiator ? 'start-node ' : '') +
        (nodeConfig.error ? 'active error' : '')
      "
    >
      <div
        class="title"
        :style="{
          backgroundColor: nodePreset.color
        }"
      >
        <!-- 这里处理普通节点的样式 -->
        <span v-if="nodeConfig.type === NodeTypeEnum.Initiator">{{ nodeConfig.nodeName }}</span>
        <template v-else>
          <span style="margin-right: 10px">
            <icon :icon="nodePreset.icon"></icon>
          </span>

          <span class="editable-title">{{ nodeConfig.nodeName }}</span>
          <i class="anticon anticon-close close" @click="delNode"></i>
        </template>
      </div>
      <div class="content">
        <div class="text"></div>
        <i class="anticon anticon-right arrow"></i>
      </div>
      <div v-if="nodeConfig.error" class="error_tip">
        <i class="anticon anticon-exclamation-circle"></i>
      </div>
    </div>
    <AddNode :node-config="nodeConfig" />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { NodeTypeEnum, NodeConfigEnum } from './constant'
import { useWorkflowContext } from './store'

import Icon from './components/icon.vue'
import AddNode from './add-node.vue'

const props = defineProps({
  nodeConfig: {
    type: Object,
    default: () => ({})
  }
})

const { removeNode } = useWorkflowContext()

const nodePreset = computed(() => {
  return NodeConfigEnum[props.nodeConfig.type] || {}
})

// 删除纯节点
const delNode = () => {
  removeNode(props.nodeConfig)
}
</script>
