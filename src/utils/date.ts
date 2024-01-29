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
