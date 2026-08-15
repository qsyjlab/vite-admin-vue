import type { ProResultStatus } from './pro-result'

const defaultContent: Record<ProResultStatus, { title: string; subTitle: string }> = {
  success: { title: '操作成功', subTitle: '请求已经成功完成' },
  error: { title: '操作失败', subTitle: '请求处理失败，请稍后重试' },
  warning: { title: '需要注意', subTitle: '请检查相关信息后继续' },
  info: { title: '提示信息', subTitle: '请根据提示继续操作' },
  '403': { title: '403', subTitle: '抱歉，你无权访问此页面' },
  '404': { title: '404', subTitle: '抱歉，你访问的页面不存在' },
  '500': { title: '500', subTitle: '服务器发生错误，请稍后重试' }
}

export function getProResultDefaultContent(status: ProResultStatus) {
  return defaultContent[status]
}
