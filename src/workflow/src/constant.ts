export const bgColors = ['87, 106, 149', '255, 148, 62', '50, 150, 250']
// 类型枚举
export const NodeTypeEnum = {
  // 发起人
  Initiator: 0,
  // 审批人
  Approver: 1,
  // 抄送人
  CC: 2,
  // 条件分支 分支判定节点
  Conditional_Node: 3,
  // 条件分支
  Conditional_Branch: 4,

  // 包容分支
  Inclusive_Branch: 5,
  // 包容分支 判定节点
  Inclusive_Node: 6,

  // 并行分支
  Parallel_Branch: 7,
  // 并行分支 判定节点
  Parallel_Node: 8,
  // 触发器
  Trigger: 9,
  // 延时等待
  Delay: 10,
  // 办理人
  Processor: 11
}

// 作为节点的生成默认文案 配置等
export const NodeConfigEnum = {
  [NodeTypeEnum.Initiator]: {
    nodeName: '发起人',
    placeholder: '请选择',
    color: 'rgb(122, 147, 157)'
  },
  [NodeTypeEnum.Approver]: {
    nodeName: '审批人',
    placeholder: '请选择',
    color: 'rgb(247, 143, 95)',
    icon: 'approver'
  },

  [NodeTypeEnum.CC]: {
    nodeName: '抄送人',
    placeholder: '请选择',
    color: 'rgb(64, 158, 255)',
    icon: 'cc'
  },
  [NodeTypeEnum.Processor]: {
    nodeName: '办理人',
    placeholder: '请选择',
    color: 'rgb(230, 176, 57)',
    icon: 'processor'
  },
  [NodeTypeEnum.Trigger]: {
    nodeName: '触发器',
    placeholder: '请选择',
    color: 'rgb(53, 184, 129)',
    icon: 'trigger'
  },
  [NodeTypeEnum.Delay]: {
    nodeName: '延迟处理',
    placeholder: '等待多少分钟',
    color: 'rgb(249, 81, 102)',
    icon: 'delay'
  },
  [NodeTypeEnum.Conditional_Node]: {
    nodeName: '条件',
    placeholder: '请设置分支条件',
    color: '#15bca3',
    icon: 'conditional'
  },
  [NodeTypeEnum.Conditional_Branch]: {
    nodeName: '条件分支',
    color: '#15bca3',
    icon: 'conditional'
  },
  [NodeTypeEnum.Inclusive_Node]: {
    nodeName: '包容条件',
    placeholder: '并行任务同时进行',
    color: '#425c9d',
    icon: 'inclusive'
  },
  [NodeTypeEnum.Inclusive_Branch]: {
    nodeName: '包容分支',
    color: '#425c9d',
    icon: 'inclusive'
  },
  [NodeTypeEnum.Parallel_Node]: {
    nodeName: '分支',
    placeholder: '请设置分支条件',
    color: '#718dff',
    icon: 'parallel'
  },
  [NodeTypeEnum.Parallel_Branch]: {
    nodeName: '并行分支',
    color: '#718dff',
    icon: 'parallel'
  }
}
