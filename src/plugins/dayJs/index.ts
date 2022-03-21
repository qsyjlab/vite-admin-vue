/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-21 11:57:37
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 13:11:02
 * @FilePath: \vite-admin-vue\src\plugins\dayJs\index.ts
 */
import * as dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

export default () => {
  dayjs.locale('zh-cn')
}
