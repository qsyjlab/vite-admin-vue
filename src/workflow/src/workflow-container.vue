<template>
  <div class="workflow-container">
    <!-- <button type="button" class="ant-btn button-publish" @click="goPublic">
      <span>发 布</span>
    </button> -->
    <div class="workflow-container__content fd-nav-content">
      <section class="workflow-container__canvas dingflow-design">
        <div class="zoom">
          <div
            class="zoom-out"
            :class="workFlowState.scale == 50 && 'disabled'"
            @click="updateZoomSize('d')"
          ></div>
          <span>{{ workFlowState.scale }}%</span>
          <div
            class="zoom-in"
            :class="workFlowState.scale == 300 && 'disabled'"
            @click="updateZoomSize('i')"
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

    <el-drawer
      :model-value="workFlowState.drawerVisible"
      append-to-body
      direction="rtl"
      @close="closeDrawer"
    >
      <template #header> 节点配置 </template>

      处理各个节点逻辑
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { useWorkflowDesignStore, createWorkflowContext } from './store'
import NodeRenderer from './node-renderer.vue'
import { createNode } from './utils'
import { NodeTypeEnum } from './constant'
// mock
import { getWorkFlowData } from './mock'

const workFlowDesignStore = useWorkflowDesignStore()

const { workFlowState, updateZoomSize, setNodeConfig, flowToJson, closeDrawer } =
  workFlowDesignStore

createWorkflowContext(workFlowDesignStore)

setNodeConfig(createNode(NodeTypeEnum.Initiator))
// getFlowData()

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

  setNodeConfig(data.nodeConfig)
}

function goPublic() {
  console.log('workFlowState', workFlowState.node)

  console.log('flowToJson()', flowToJson())
}
</script>
<style lang="scss" scoped>
@import './theme.css';

.workflow-container {
  height: 100%;
  position: relative;
  display: flex;
  // flex-direction: column;
  background-color: #f5f5f7;
  overflow: auto;

  &__header {
    height: 50px;
  }

  &__content {
    height: 100%;
    flex: 1;
    position: relative;
  }

  &__canvas {
    // height: 100%;
    // overflow: hidden;
  }
}
</style>
