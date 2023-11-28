import { reactive, InjectionKey } from 'vue'
import { useContext, createContext } from './use-context'
import { conditionStr } from './utils'
import { NodeTypeEnum } from './constant'

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

  /**
   * 如果没有指定 root 则初始化信息
   * 指定 root 则 更新 childNode
   */
  function setNodeConfig(node, root?: any) {
    if (root && root._parent) {
      root._parent.childNode = node
    } else {
      // 设置跟节点
      state.node = node
    }
  }

  // 像某个节点插入一个节点
  function insertNode(node, root?: any) {
    const childNode = root.childNode

    if (childNode) {
      childNode.__parent = node
    }

    node.childNode = childNode
    node._parent = root
    root.childNode = node
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

    function reData(data, addData) {
      if (!data.childNode) {
        data.childNode = addData
      } else {
        reData(data.childNode, addData)
      }
    }

    if (conditionNodes.length === 1) {
      debugger
      if (node.childNode) {
        if (conditionNodes[0].childNode) {
          reData(conditionNodes[0].childNode, node.childNode)
        } else {
          setNodeConfig(node.childNode, node)

          conditionNodes[0].childNode = node.childNode
        }
      }

      setNodeConfig(conditionNodes[0].childNode, node)
    }
  }

  // 基于原有条件插入新的条件式子
  function insertConditionNodesToNode(node) {
    const len = node.conditionNodes.length + 1

    const newConditionNode = {
      nodeName: '条件' + len,
      type: 3,
      priorityLevel: len,
      conditionList: [],
      nodeUserList: [],
      childNode: null
    }

    node.conditionNodes.push(newConditionNode)

    resetConditionNodesErr(node)
  }

  // 判定语句生成
  function resetConditionNodesErr(node) {
    for (let i = 0; i < node.conditionNodes.length; i++) {
      node.conditionNodes[i].error =
        conditionStr(node, i) == '请设置条件' && i != node.conditionNodes.length - 1
    }
  }

  // 这里只做工厂创建节点
  function createNode(type) {
    switch (type) {
      case NodeTypeEnum.Approver:
        return {
          nodeName: '审核人' + new Date().getTime(),
          error: true,
          type: 1,
          settype: 1,
          selectMode: 0,
          selectRange: 0,
          directorLevel: 1,
          examineMode: 1,
          noHanderAction: 1,
          examineEndDirectorLevel: 0,
          nodeUserList: []
        }
      case NodeTypeEnum.CC:
        return {
          nodeName: '抄送人',
          type: 2,
          ccSelfSelectFlag: 1,
          nodeUserList: []
        }
      case NodeTypeEnum.Conditional_Branch:
        return {
          nodeName: '路由',
          type: 4,
          childNode: null,
          conditionNodes: [
            {
              nodeName: '条件1',
              error: true,
              type: 3,
              priorityLevel: 1,
              conditionList: [],
              nodeUserList: [],
              childNode: null
            },
            {
              nodeName: '条件2',
              type: 3,
              priorityLevel: 2,
              conditionList: [],
              nodeUserList: [],
              childNode: null
            }
          ]
        }
      default:
        return null
    }
  }

  return {
    workFlowState: state,
    updateZoomSize,
    setNodeConfig,
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
