<!--
 * @Date: 2022-09-21 14:41:53
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-05-24 15:20:24
 * @FilePath: /Workflow-Vue3/src/components/node-renderer.vue
-->
<template>
  <div v-if="[NodeTypeEnum.Approver, NodeTypeEnum.CC].includes(nodeConfig.type)" class="node-wrap">
    <div
      class="node-wrap-box"
      :class="
        (nodeConfig.type == 0 ? 'start-node ' : '') +
        (isTried && nodeConfig.error ? 'active error' : '')
      "
    >
      <div class="title" :style="`background: rgb(${bgColors[nodeConfig.type]});`">
        <span v-if="nodeConfig.type == 0">{{ nodeConfig.nodeName }}</span>
        <template v-else>
          <span class="iconfont">图标占位</span>
          <input
            v-if="isInput"
            type="text"
            class="ant-input editable-title-input"
            :placeholder="defaultText"
            @blur="blurEvent()"
          />
          <span v-else class="editable-title" @click="clickEvent()">{{ nodeConfig.nodeName }}</span>
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
  <div
    v-if="
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
import AddNode from './add-node.vue'
import { bgColors } from './constant'
import { useWorkflowContext } from './store'
import { NodeTypeEnum } from './constant'

const props = defineProps({
  nodeConfig: {
    type: Object,
    default: () => ({})
  }
})

const { setNodeConfig, removeConditionBranch, insertConditionNodesToNode } = useWorkflowContext()

const isTried = false

const isInput = false

const defaultText = ''
const showText = ''
const isInputList = []

const blurEvent = (index?) => {}
const clickEvent = (index?) => {}

// 删除纯节点
const delNode = () => {
  setNodeConfig(props.nodeConfig.childNode, props.nodeConfig)
}

// 删除条件
const delTerm = index => {
  removeConditionBranch(props.nodeConfig, index)
}

// 添加条件
const addTerm = () => {
  insertConditionNodesToNode(props.nodeConfig)
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
