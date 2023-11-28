import { NodeTypeEnum } from './constant'

// TODO: 开源项目固有代码 待排查
export function conditionStr(nodeConfig, index) {
  const { conditionList, nodeUserList } = nodeConfig.conditionNodes[index]
  if (conditionList.length == 0) {
    return index == nodeConfig.conditionNodes.length - 1 &&
      nodeConfig.conditionNodes[0].conditionList.length != 0
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

// 这里只做工厂创建节点
export function createNode(type) {
  switch (type) {
    case NodeTypeEnum.Approver:
      return {
        nodeName: '审核人' + new Date().getTime(),
        error: true,
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
    default:
      return null
  }
}
