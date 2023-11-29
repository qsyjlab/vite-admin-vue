import { reactive, InjectionKey } from 'vue'
import { useContext, createContext } from './use-context'
import { conditionStr, createConditionNode, createNode, deepRemoveParentReference } from './utils'

export function useWorkflowDesignStore() {
  const state = reactive<{
    scale: number
    node: any
  }>({
    // 画布缩放倍率
    scale: 100,
    // 节点信息数据
    node: {}
  })

  // 处理逻辑层插入
  function insertFlowNode(type, root) {
    if (!root) return
    const newNode = createNode(type)
    insertNode(newNode, root)
  }

  // 像某个节点插入一个节点
  // 只做节点操作 让 addFlowNode 来做逻辑层操作
  function insertNode(node, root?: any) {
    const childNode = root.childNode

    if (childNode) {
      childNode._parent = node
      node.childNode = childNode
    }
    root.childNode = node
    node._parent = root
  }

  /**
   * 传入当前节点 将父级节点的指向自己的子节点 ，子节点指向当前节点的父节点
   */
  function removeNode(node) {
    const childNode = node.childNode

    if (childNode) {
      childNode._parent = node._parent
    }

    node._parent.childNode = childNode
  }

  // 移除某个条件流程
  function removeConditionBranch(node, index) {
    if (!node?.conditionNodes.length) return

    const conditionNodes = node.conditionNodes

    conditionNodes.splice(index, 1)
    conditionNodes.map((condition, index) => {
      condition.priorityLevel = index + 1
      condition.nodeName = `条件${index + 1}`
    })

    resetConditionNodesErr(node)

    // 递归连接后续 childNode
    function reData(data, addData) {
      if (!data.childNode) {
        data.childNode = addData
        addData._parent = data
      } else {
        reData(data.childNode, addData)
      }
    }

    if (conditionNodes.length === 1) {
      if (node.childNode) {
        if (conditionNodes[0].childNode) {
          reData(conditionNodes[0].childNode, node.childNode)
        } else {
          console.log('没有 childrenNOde')
          conditionNodes[0].childNode = node.childNode
        }
      }

      // 这里额外处理下 剩余一个子节点需要连接当前 流程节点的父节点 以及 父节点的子节点
      // 有两种情况一种是下面有 n 个节点 另一种是 嵌套空条件
      const childNode = conditionNodes[0].childNode

      if (node._parent && childNode) {
        childNode._parent = node._parent
        node._parent.childNode = childNode
      } else {
        node._parent.childNode = conditionNodes[0].childNode
      }
    }
  }

  // 基于原有条件插入新的条件式子
  function insertConditionNodesToNode(node, type) {
    const len = node.conditionNodes.length + 1

    const newConditionNode = createConditionNode(type, { nodeName: `条件${len}` })

    node.conditionNodes.push(newConditionNode)

    resetConditionNodesErr(node)
  }

  // 更新画布缩放倍率
  function updateZoomSize(type?: 'i' | 'd', value = 10) {
    if (type === 'i') {
      if (state.scale === 50) {
        return
      }
      state.scale += value
    } else if (type === 'd') {
      if (state.scale === 300) {
        return
      }

      state.scale -= value
    }
  }

  function setNodeConfig(node) {
    state.node = node
  }

  // 判定语句生成
  function resetConditionNodesErr(node) {
    for (let i = 0; i < node.conditionNodes.length; i++) {
      node.conditionNodes[i].error =
        conditionStr(node, i) == '请设置条件' && i != node.conditionNodes.length - 1
    }
  }

  // 拷贝一层数据做提交使用
  function flowToJson() {
    return JSON.parse(JSON.stringify(deepRemoveParentReference(state.node)))
  }

  return {
    workFlowState: state,
    flowToJson,
    updateZoomSize,
    removeNode,
    setNodeConfig,
    insertFlowNode,
    insertNode,
    createNode,
    removeConditionBranch,
    insertConditionNodesToNode
  }
}

type WorkflowReturn = ReturnType<typeof useWorkflowDesignStore>

const workflowStoreKey: InjectionKey<WorkflowReturn> = Symbol()

export function createWorkflowContext(context: any) {
  return createContext(context, workflowStoreKey)
}

export function useWorkflowContext() {
  return useContext(workflowStoreKey)
}
