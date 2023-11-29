<template>
  <div class="add-node-btn-box">
    <div class="add-node-btn">
      <el-popover v-model:visible="visible" width="auto">
        <h3 class="header">添加流程节点</h3>

        <div class="node-events">
          <div
            v-for="(item, index) in nodeEventsList"
            :key="index"
            class="node-events__item"
            @click="addFlowNode(item.type)"
          >
            <div class="icon">
              <icon size="25" :color="item.color" :icon="item.icon"></icon>
            </div>

            <div class="title">
              {{ item.nodeName }}
            </div>
          </div>
        </div>

        <div v-if="false" class="add-node-popover-body">
          <a class="add-node-popover-item approver" @click="addFlowNode(NodeTypeEnum.Approver)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>审批人</p>
          </a>
          <a class="add-node-popover-item approver" @click="addFlowNode(NodeTypeEnum.Processor)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>办理人</p>
          </a>
          <a class="add-node-popover-item notifier" @click="addFlowNode(NodeTypeEnum.CC)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>抄送人</p>
          </a>
          <a
            class="add-node-popover-item condition"
            @click="addFlowNode(NodeTypeEnum.Conditional_Branch)"
          >
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>条件分支</p>
          </a>
        </div>
        <div v-if="false" class="add-node-popover-body">
          <a
            class="add-node-popover-item condition"
            @click="addFlowNode(NodeTypeEnum.Inclusive_Branch)"
          >
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>包容分支</p>
          </a>
          <a
            class="add-node-popover-item condition"
            @click="addFlowNode(NodeTypeEnum.Parallel_Branch)"
          >
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>并行分支</p>
          </a>
          <a class="add-node-popover-item approver" @click="addFlowNode(NodeTypeEnum.Trigger)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>触发器</p>
          </a>
          <a class="add-node-popover-item approver" @click="addFlowNode(NodeTypeEnum.Delay)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>延时等待</p>
          </a>
        </div>

        <template #reference>
          <button class="btn" type="button">
            <span class="iconfont"></span>
          </button>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWorkflowContext } from './store'
import { NodeTypeEnum, NodeConfigEnum } from './constant'
import Icon from './components/icon.vue'

const props = defineProps({
  nodeConfig: {
    type: Object,
    default: () => ({})
  }
})

const visible = ref(false)

const { insertFlowNode } = useWorkflowContext()

const nodeEventsList = ref<any[]>([])

initilaizeEventsList()

function initilaizeEventsList() {
  Object.keys(NodeConfigEnum).forEach(key => {
    if (
      ![
        NodeTypeEnum.Initiator,
        NodeTypeEnum.Parallel_Node,
        NodeTypeEnum.Inclusive_Node,
        NodeTypeEnum.Conditional_Node
      ].includes(Number(key))
    ) {
      nodeEventsList.value.push({
        ...NodeConfigEnum[key],
        type: Number(key)
      })
    }
  })
}

const addFlowNode = type => {
  console.log('type', type)

  visible.value = false
  insertFlowNode(type, props.nodeConfig)
}
</script>
<style scoped lang="scss">
.header {
  padding: 10px;
}
.node-events {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  &__item {
    background-color: #f8f9f9;
    padding: 15px;
    width: 150px;
    display: flex;
    align-items: center;
    border-radius: 10px;
    cursor: pointer;

    .icon {
      height: 37px;
      width: 37px;
      box-sizing: border-box;
      padding: 5px;
      border: 1px solid #dedfdf;
      border-radius: 14px;
      margin-right: 5px;
    }
  }
}

.add-node-btn-box {
  width: 240px;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    margin: auto;
    width: 2px;
    height: 100%;
    background-color: #cacaca;
  }
  .add-node-btn {
    user-select: none;
    width: 240px;
    padding: 20px 0 32px;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    flex-shrink: 0;
    -webkit-box-flex: 1;
    flex-grow: 1;
    .btn {
      outline: none;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      width: 30px;
      height: 30px;
      background: #3296fa;
      border-radius: 50%;
      position: relative;
      border: none;
      line-height: 30px;
      -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      .iconfont {
        color: #fff;
        font-size: 16px;
      }
      &:hover {
        transform: scale(1.3);
        box-shadow: 0 13px 27px 0 rgba(0, 0, 0, 0.1);
      }
      &:active {
        transform: none;
        background: #1e83e9;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
