import { defineAppPlugin } from '@/utils'
import * as dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

export default defineAppPlugin(() => {
  dayjs.locale('zh-cn')
})
