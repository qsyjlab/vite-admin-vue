export type ProjectStatus = 'active' | 'risk' | 'done'

export interface ProjectRecord {
  id: number
  name: string
  summary: string
  owner: string
  department: string
  status: ProjectStatus
  progress: number
  tasks: number
  updatedAt: string
}

export const projectStatusMap: Record<
  ProjectStatus,
  { text: string; type: 'success' | 'warning' | 'info' }
> = {
  active: { text: '进行中', type: 'success' },
  risk: { text: '有风险', type: 'warning' },
  done: { text: '已完成', type: 'info' }
}

export const projectRecords: ProjectRecord[] = [
  {
    id: 1,
    name: '客户数据中台',
    summary: '统一客户主数据与标签资产，支持销售和运营场景。',
    owner: '陈晨',
    department: '数据平台',
    status: 'active',
    progress: 76,
    tasks: 18,
    updatedAt: '今天 10:32'
  },
  {
    id: 2,
    name: '供应链预警中心',
    summary: '整合库存、采购和物流节点，提前识别交付风险。',
    owner: '林涛',
    department: '供应链',
    status: 'risk',
    progress: 48,
    tasks: 27,
    updatedAt: '今天 09:18'
  },
  {
    id: 3,
    name: '移动审批升级',
    summary: '重构高频审批流程并完善移动端消息触达。',
    owner: '周宁',
    department: '协同办公',
    status: 'active',
    progress: 63,
    tasks: 12,
    updatedAt: '昨天 18:46'
  },
  {
    id: 4,
    name: '财务月结自动化',
    summary: '自动归集凭证、核对差异并生成月结任务清单。',
    owner: '吴敏',
    department: '财务科技',
    status: 'done',
    progress: 100,
    tasks: 8,
    updatedAt: '昨天 15:20'
  },
  {
    id: 5,
    name: '门店经营驾驶舱',
    summary: '提供门店经营指标、异常诊断和区域对比视图。',
    owner: '许峰',
    department: '零售业务',
    status: 'active',
    progress: 82,
    tasks: 16,
    updatedAt: '07-11 16:40'
  },
  {
    id: 6,
    name: '知识库治理',
    summary: '梳理知识目录、内容责任人和过期提醒机制。',
    owner: '何佳',
    department: '企业服务',
    status: 'risk',
    progress: 35,
    tasks: 31,
    updatedAt: '07-11 14:05'
  },
  {
    id: 7,
    name: '统一账号中心',
    summary: '整合内部应用身份、组织关系和权限审计能力。',
    owner: '王屹',
    department: '基础架构',
    status: 'active',
    progress: 69,
    tasks: 22,
    updatedAt: '07-10 17:22'
  },
  {
    id: 8,
    name: '客服质检助手',
    summary: '基于会话规则识别服务问题并生成改进建议。',
    owner: '赵可',
    department: '客户体验',
    status: 'done',
    progress: 100,
    tasks: 11,
    updatedAt: '07-10 11:48'
  },
  {
    id: 9,
    name: '营销活动平台',
    summary: '沉淀活动模板、预算控制和效果归因流程。',
    owner: '罗欣',
    department: '增长运营',
    status: 'active',
    progress: 57,
    tasks: 25,
    updatedAt: '07-09 19:30'
  },
  {
    id: 10,
    name: '合同履约跟踪',
    summary: '关联合同条款、交付节点、回款计划与风险事项。',
    owner: '孙博',
    department: '法务运营',
    status: 'risk',
    progress: 41,
    tasks: 19,
    updatedAt: '07-09 14:12'
  },
  {
    id: 11,
    name: '研发效能度量',
    summary: '聚合迭代、质量和交付数据，形成团队改进闭环。',
    owner: '秦朗',
    department: '研发平台',
    status: 'active',
    progress: 72,
    tasks: 14,
    updatedAt: '07-08 16:05'
  },
  {
    id: 12,
    name: '资产盘点数字化',
    summary: '移动盘点固定资产，自动匹配差异并跟踪处置。',
    owner: '唐悦',
    department: '行政管理',
    status: 'done',
    progress: 100,
    tasks: 9,
    updatedAt: '07-08 10:26'
  }
]
