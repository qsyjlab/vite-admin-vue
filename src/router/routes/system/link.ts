/*
 * @Description:
 * @Version:
 * @Autor: qsyj
 * @Date: 2022-03-28 22:12:25
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-28 22:28:51
 */

import { createBlankContainer } from '@/layouts'
import { defineExposeRoutes } from '@/utils'

export default defineExposeRoutes([
  {
    name: 'OutLink',
    path: 'out-link',
    meta: {
      isNotAuth: true,
      sort: 7,
      title: '外链',
      href: 'https://blog.csdn.net/weixin_44575130/article/details/118993154'
    },
    component: createBlankContainer('OutLink')
  }
])
