import { NodeTypeEnum } from './constant'

// 这里只做工厂创建节点
// TODO: 实际业务中可能需额外拓展 data 字段来存放实际业务节点信息
export function createNode(type) {
  switch (type) {
    case NodeTypeEnum.Approver:
      return {
        nodeName: '审核人' + new Date().getTime(),
        error: false,
        type: NodeTypeEnum.Approver,
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
        type: NodeTypeEnum.CC,
        ccSelfSelectFlag: 1,
        nodeUserList: []
      }
    case NodeTypeEnum.Conditional_Branch:
      return {
        nodeName: '条件分支',
        type: NodeTypeEnum.Conditional_Branch,
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
    case NodeTypeEnum.Inclusive_Branch:
      return {
        nodeName: '包容分支',
        type: NodeTypeEnum.Inclusive_Branch,
        childNode: null,
        conditionNodes: [
          {
            nodeName: '分支1',
            error: true,
            type: NodeTypeEnum.Inclusive_Node,
            priorityLevel: 1,
            conditionList: [],
            nodeUserList: [],
            childNode: null
          },
          {
            nodeName: '分支1',
            type: NodeTypeEnum.Inclusive_Node,
            priorityLevel: 2,
            conditionList: [],
            nodeUserList: [],
            childNode: null
          }
        ]
      }
    case NodeTypeEnum.Parallel_Branch:
      return {
        nodeName: '并行分支',
        type: NodeTypeEnum.Parallel_Branch,
        childNode: null,
        conditionNodes: [
          {
            nodeName: '并行分支1',
            error: true,
            type: NodeTypeEnum.Parallel_Node,
            priorityLevel: 1,
            conditionList: [],
            nodeUserList: [],
            childNode: null
          },
          {
            nodeName: '分支1',
            type: NodeTypeEnum.Parallel_Node,
            priorityLevel: 2,
            conditionList: [],
            nodeUserList: [],
            childNode: null
          }
        ]
      }
    case NodeTypeEnum.Trigger: {
      return {
        nodeName: '触发器',
        type: NodeTypeEnum.Trigger
      }
    }
    case NodeTypeEnum.Delay: {
      return {
        nodeName: '延时等待',
        type: NodeTypeEnum.Delay
      }
    }
    case NodeTypeEnum.Processor: {
      return {
        nodeName: '办理人',
        type: NodeTypeEnum.Processor
      }
    }
    case NodeTypeEnum.Initiator: {
      return {
        nodeName: '发起人',
        type: NodeTypeEnum.Initiator
      }
    }
    default:
      return null
  }
}

// 创建分支类型的条件节点
export function createConditionNode(type, config = {}) {
  switch (type) {
    case NodeTypeEnum.Conditional_Node: {
      return {
        nodeName: '条件1',
        error: true,
        childNode: null,
        ...config,
        type: NodeTypeEnum.Conditional_Node
      }
    }
    case NodeTypeEnum.Inclusive_Node: {
      return {
        nodeName: '条件1',
        error: true,
        childNode: null,
        ...config,
        type: NodeTypeEnum.Inclusive_Node
      }
    }

    case NodeTypeEnum.Parallel_Node: {
      return {
        nodeName: '条件1',
        error: true,
        childNode: null,
        ...config,
        type: NodeTypeEnum.Parallel_Node
      }
    }

    default:
      return null
  }
}

export function deepRemoveParentReference(obj, originalToCopyMap = new WeakMap()) {
  // 如果是基本数据类型，则直接返回
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  // 如果对象已经被复制过，直接返回复制后的对象，避免循环引用导致无限递归
  if (originalToCopyMap.has(obj)) {
    return originalToCopyMap.get(obj)
  }

  // 创建一个新的对象或数组
  const copy = Array.isArray(obj) ? [] : {}

  // 将原始对象和对应的复制对象存储在 Map 中
  originalToCopyMap.set(obj, copy)

  // 递归复制属性，同时忽略 _parent 属性
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && key !== '_parent') {
      copy[key] = deepRemoveParentReference(obj[key], originalToCopyMap)
    }
  }

  return copy
}

// TODO: 开源项目固有代码 待排查
export function conditionStr(nodeConfig, index) {
  const { conditionList, nodeUserList } = nodeConfig.conditionNodes[index]
  if (conditionList.length == 0) {
    return index == nodeConfig.conditionNodes.length - 1 &&
      nodeConfig.conditionNodes?.[0].conditionList?.length != 0
      ? '其他条件进入此流程'
      : '请设置条件'
  } else {
    let str = ''
    for (let i = 0; i < conditionList.length; i++) {
      const {
        columnId,
        columnType,
        showType,
        showName,
        optType,
        zdy1,
        opt1,
        zdy2,
        opt2,
        fixedDownBoxValue
      } = conditionList[i]
      if (columnId == 0) {
        if (nodeUserList.length != 0) {
          str += '发起人属于：'
          str +=
            nodeUserList
              .map(item => {
                return item.name
              })
              .join('或') + ' 并且 '
        }
      }
      if (columnType == 'String' && showType == '3') {
        if (zdy1) {
          str += showName + '属于：' + dealStr(zdy1, JSON.parse(fixedDownBoxValue)) + ' 并且 '
        }
      }
      if (columnType == 'Double') {
        if (optType != 6 && zdy1) {
          const optTypeStr = ['', '<', '>', '≤', '=', '≥'][optType]
          str += `${showName} ${optTypeStr} ${zdy1} 并且 `
        } else if (optType == 6 && zdy1 && zdy2) {
          str += `${zdy1} ${opt1} ${showName} ${opt2} ${zdy2} 并且 `
        }
      }
    }
    return str ? str.substring(0, str.length - 4) : '请设置条件'
  }
}

// TODO: 开源项目固有代码 待排查
export function dealStr(str, obj) {
  const arr = []
  const list = str.split(',')
  for (const elem in obj) {
    list.map(item => {
      if (item == elem) {
        arr.push(obj[elem].value)
      }
    })
  }
  return arr.join('或')
}
