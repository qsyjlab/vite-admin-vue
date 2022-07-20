/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-21 11:57:37
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 16:03:55
 * @FilePath: \vite-admin-vue\src\plugins\dayJs\index.ts
 */
import { defineAppPlugin } from '@/utils'
import * as dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

export default defineAppPlugin(() => {
  dayjs.locale('zh-cn')
})
