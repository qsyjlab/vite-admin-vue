<template>
  <div class="workflow-container">
    <div class="workflow-container__header">
      <div class="fd-nav-left">
        <div class="fd-nav-back">
          <i class="anticon anticon-left"></i>
        </div>
        <!-- workFlowDef.name  -->
        <div class="fd-nav-title">合同管理</div>
      </div>
      <div class="fd-nav-right">
        <!-- <button type="button" class="ant-btn button-publish" @click="saveSet">
          <span>发 布</span>
        </button> -->
      </div>
    </div>
    <div class="workflow-container__content fd-nav-content">
      <section class="workflow-container__canvas dingflow-design">
        <div class="zoom">
          <div
            class="zoom-out"
            :class="workFlowState.scale == 50 && 'disabled'"
            @click="updateZoomSize('i')"
          ></div>
          <span>{{ workFlowState.scale }}%</span>
          <div
            class="zoom-in"
            :class="workFlowState.scale == 300 && 'disabled'"
            @click="updateZoomSize()"
          ></div>
        </div>
        <div class="box-scale" :style="`transform: scale(${workFlowState.scale / 100});`">
          <node-renderer
            v-if="Object.keys(workFlowState.node).length"
            :node-config="workFlowState.node"
          />

          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>
    <!-- <errorDialog v-model:visible="tipVisible" :list="tipList" />
    <promoterDrawer />
    <approverDrawer :director-max-level="directorMaxLevel" />
    <copyerDrawer />
    <conditionDrawer /> -->
  </div>
</template>

<script setup lang="ts">
import { useWorkflowDesignStore, createWorkflowContext } from './store'
import NodeRenderer from './node-renderer.vue'
// mock
import { getWorkFlowData } from './mock'

const workFlowDesignStore = useWorkflowDesignStore()

const { workFlowState, updateZoomSize, setNodeConfig } = workFlowDesignStore

createWorkflowContext(workFlowDesignStore)

getFlowData()

async function getFlowData() {
  const { data } = await getWorkFlowData()

  function recursive(node, parent = null) {
    if (parent) {
      node._parent = parent
    }
    if (node.childNode) {
      recursive(node.childNode, node)
    }

    // 条件节点的子节点需要遍历
    if (node.conditionNodes) {
      node.conditionNodes.forEach(conditionNode => {
        if (conditionNode.childNode) {
          recursive(conditionNode.childNode, conditionNode)
        }
      })
    }

    return node
  }

  recursive(data.nodeConfig)

  console.log('data.nodeConfig', data.nodeConfig)

  setNodeConfig(data.nodeConfig)
}
</script>
<style lang="scss" scoped>
@import './theme.css';

.workflow-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f7;

  &__header {
    height: 50px;
  }

  &__content {
    flex: 1;
  }

  &__canvas {
    height: 100%;
  }
}
</style>
