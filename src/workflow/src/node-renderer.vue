<template>
  <div
    v-if="
      false &&
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
      <div class="title" :style="`background: rgb(${bgColors[nodeConfig.type]});`">
        <!-- 这里处理普通节点的样式 -->
        <span v-if="nodeConfig.type === NodeTypeEnum.Initiator">{{ nodeConfig.nodeName }}</span>
        <template v-else>
          <span class="iconfont"></span>

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

  <!-- 普通节点渲染 -->
  <node-card :node-config="nodeConfig"></node-card>
  <!-- 条件分支 -->
  <condition-branch
    v-if="[NodeTypeEnum.Conditional_Branch].includes(nodeConfig.type)"
    :node-config="nodeConfig"
  ></condition-branch>

  <!-- 包容分支 -->
  <inclusive-branch
    v-if="[NodeTypeEnum.Inclusive_Branch].includes(nodeConfig.type)"
    :node-config="nodeConfig"
  ></inclusive-branch>

  <!-- 并行分支 -->
  <parallel-branch
    v-if="[NodeTypeEnum.Parallel_Branch].includes(nodeConfig.type)"
    :node-config="nodeConfig"
  ></parallel-branch>

  <node-renderer v-if="nodeConfig.childNode" :node-config="nodeConfig.childNode" />
</template>
<script setup lang="ts">
import ConditionBranch from './condition-branch.vue'
import InclusiveBranch from './inclusive-branch.vue'
import ParallelBranch from './parallel-branch.vue'
import NodeCard from './node-card.vue'

import AddNode from './add-node.vue'

import { useWorkflowContext } from './store'
import { NodeTypeEnum, bgColors } from './constant'

const props = defineProps({
  nodeConfig: {
    type: Object,
    default: () => ({})
  }
})

const { removeNode } = useWorkflowContext()

// 删除纯节点
const delNode = () => {
  removeNode(props.nodeConfig)
}
</script>
<style>
@import url('./theme.css');

.error_tip {
  position: absolute;
  top: 0px;
  right: 0px;
  transform: translate(150%, 0px);
  font-size: 24px;
}

.promoter_person .el-dialog__body {
  padding: 10px 20px 14px 20px;
}

.selected_list {
  margin-bottom: 20px;
  line-height: 30px;
}

.selected_list span {
  margin-right: 10px;
  padding: 3px 6px 3px 9px;
  line-height: 12px;
  white-space: nowrap;
  border-radius: 2px;
  border: 1px solid rgba(220, 220, 220, 1);
}

.selected_list img {
  margin-left: 5px;
  width: 7px;
  height: 7px;
  cursor: pointer;
}
</style>
