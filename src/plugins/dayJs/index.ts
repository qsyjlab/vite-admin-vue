import { defineAppPlugin } from '@/utils'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

export default defineAppPlugin(() => {
  dayjs.locale('zh-cn')
})
