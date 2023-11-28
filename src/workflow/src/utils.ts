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
