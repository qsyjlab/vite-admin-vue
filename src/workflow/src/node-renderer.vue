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
        (isTried && nodeConfig.error ? 'active error' : '')
      "
    >
      <div class="title" :style="`background: rgb(${bgColors[nodeConfig.type]});`">
        <!-- 这里处理普通节点的样式 -->
        <span v-if="nodeConfig.type === NodeTypeEnum.Initiator">{{ nodeConfig.nodeName }}</span>
        <template v-else>
          <span class="iconfont"></span>

          <span class="editable-title" @click="clickEvent()">{{ nodeConfig.nodeName }}</span>
          <i class="anticon anticon-close close" @click="delNode"></i>
        </template>
      </div>
      <div class="content" @click="setPerson">
        <div class="text">
          <span v-if="!showText" class="placeholder">请选择{{ defaultText }}</span>
          {{ showText }}
        </div>
        <i class="anticon anticon-right arrow"></i>
      </div>
      <div v-if="isTried && nodeConfig.error" class="error_tip">
        <i class="anticon anticon-exclamation-circle"></i>
      </div>
    </div>
    <AddNode :node-config="nodeConfig" />
  </div>
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

  <div
    v-if="
      false &&
      [NodeTypeEnum.Conditional_Branch, NodeTypeEnum.Inclusive_Branch].includes(nodeConfig.type)
    "
    class="branch-wrap"
  >
    <div class="branch-box-wrap">
      <div class="branch-box">
        <button class="add-branch" @click="addTerm">添加条件</button>
        <div v-for="(item, index) in nodeConfig.conditionNodes" :key="index" class="col-box">
          <div class="condition-node">
            <div class="condition-node-box">
              <div class="auto-judge" :class="isTried && item.error ? 'error active' : ''">
                <div v-if="index != 0" class="sort-left" @click="arrTransfer(index, -1)">&lt;</div>
                <div class="title-wrapper">
                  <input
                    v-if="isInputList[index]"
                    v-model="item.nodeName"
                    type="text"
                    class="ant-input editable-title-input"
                    @blur="blurEvent(index)"
                  />
                  <span v-else class="editable-title" @click="clickEvent(index)">{{
                    item.nodeName
                  }}</span>
                  <span class="priority-title" @click="setPerson(item.priorityLevel)"
                    >优先级{{ item.priorityLevel }}</span
                  >
                  <i class="anticon anticon-close close" @click="delTerm(index)"></i>
                </div>
                <div class="sort-right" @click="arrTransfer(index)">&gt;</div>
                <div class="content" @click="setPerson(item.priorityLevel)"></div>
                <div v-if="isTried && item.error" class="error_tip">
                  <i class="anticon anticon-exclamation-circle"></i>
                </div>
              </div>

              <AddNode :node-config="item" />
            </div>
          </div>
          <node-renderer v-if="item.childNode" v-model:nodeConfig="item.childNode" />
          <template v-if="index == 0">
            <div class="top-left-cover-line"></div>
            <div class="bottom-left-cover-line"></div>
          </template>
          <template v-if="index == nodeConfig.conditionNodes.length - 1">
            <div class="top-right-cover-line"></div>
            <div class="bottom-right-cover-line"></div>
          </template>
        </div>
      </div>
      <AddNode :node-config="nodeConfig" />
    </div>
  </div>
  <node-renderer v-if="nodeConfig.childNode" :node-config="nodeConfig.childNode" />
</template>
<script setup lang="ts">
import ConditionBranch from './condition-branch.vue'
import InclusiveBranch from './inclusive-branch.vue'
import ParallelBranch from './parallel-branch.vue'
import AddNode from './add-node.vue'

import { useWorkflowContext } from './store'
import { NodeTypeEnum, bgColors } from './constant'

const props = defineProps({
  nodeConfig: {
    type: Object,
    default: () => ({})
  }
})

const { removeNode, removeConditionBranch } = useWorkflowContext()

const isTried = false

const isInput = false

const defaultText = ''
const showText = ''
const isInputList = []

const blurEvent = (index?) => {}
const clickEvent = (index?) => {}

// 删除纯节点
const delNode = () => {
  removeNode(props.nodeConfig)
}

// 删除条件
const delTerm = index => {
  removeConditionBranch(props.nodeConfig, index)
}

// 添加条件
const addTerm = () => {
  // insertConditionNodesToNode(props.nodeConfig)
}

const setPerson = level => {
  console.log('person')
}

const arrTransfer = (index, type = 1) => {
  console.log('111')
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
