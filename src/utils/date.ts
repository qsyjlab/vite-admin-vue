import { DateFormatTemplate } from '@/enum/date'
import dayjs from 'dayjs'

/**
 * @see https://dayjs.gitee.io/docs/zh-CN/display/format
 */
export function dayJsFormatDate(
  date?: dayjs.ConfigType,
  format: string = DateFormatTemplate.SIMPLE_DATE
): string {
  return dayjs(date).format(format)
}

/**
 * 创建一个以当前时间开始 过去n天的日期
 */
export function getCurrentAndPastDate(n: number, format = 'YYYY-MM-DD') {
  const today = new Date()

  // 创建一个从当前日期往前推7天的日期
  const pastDate = new Date()
  pastDate.setDate(today.getDate() - n)

  return [pastDate, today].map(date => dayJsFormatDate(date, format))
}
