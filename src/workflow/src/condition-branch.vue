<template>
  <div class="branch-wrap">
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
          <node-renderer v-if="item.childNode" :node-config="item.childNode" />
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
</template>
<script setup lang="ts">
import AddNode from './add-node.vue'
import { useWorkflowContext } from './store'
import { NodeTypeEnum } from './constant'
import NodeRenderer from './node-renderer.vue'

const props = defineProps({
  nodeConfig: {
    type: Object,
    default: () => ({})
  }
})

const { removeConditionBranch, insertConditionNodesToNode } = useWorkflowContext()

const isTried = false

const isInputList = []

const blurEvent = (index?) => {}
const clickEvent = (index?) => {}

// 删除条件
const delTerm = index => {
  removeConditionBranch(props.nodeConfig, index)
}

// 添加条件
const addTerm = () => {
  insertConditionNodesToNode(props.nodeConfig, NodeTypeEnum.Conditional_Node)
}

const setPerson = level => {
  console.log('person')
}

const arrTransfer = (index, type = 1) => {
  console.log('111')
}
</script>
