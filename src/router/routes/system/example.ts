/*
 * @Description: 组件示例
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 22:14:21
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 13:23:01
 * @FilePath: \vite-admin-vue\src\router\routes\system\example.ts
 */

import { defineExposeRoutes } from '@/utils'

export default defineExposeRoutes([
  {
    path: '/card',
    name: 'Card',
    meta: {
      title: 'Card',
      sort: 5
    },
    component: () => import(/* webpackChunkName: "Card" */ '@/views/system/WelcomeTo.vue'),
    children: [
      {
        path: '/card-m',
        name: 'CardM',
        meta: {
          title: 'CardM'
        },
        component: () => import(/* webpackChunkName: "Card" */ '@/views/system/WelcomeTo.vue'),
        children: [
          {
            path: '/card1',
            name: 'Card1',
            meta: {
              title: 'Card1'
            },
            component: () => import(/* webpackChunkName: "Card" */ '@/views/system/WelcomeTo.vue'),
            children: []
          },
          {
            path: '/Menu1',
            name: 'Menu1',
            meta: {
              title: 'Menu1'
            },
            component: () => import(/* webpackChunkName: "Menu" */ '@/views/system/WelcomeTo.vue'),
            children: []
          },
          {
            path: '/Avatar1',
            name: 'Avatar1',
            meta: {
              title: 'Avatar1'
            },
            component: () =>
              import(/* webpackChunkName: "Avatar" */ '@/views/system/WelcomeTo.vue'),
            children: []
          }
        ]
      },
      {
        path: '/Menu',
        name: 'Menu',
        meta: {
          title: 'Menu'
        },
        component: () => import(/* webpackChunkName: "Menu" */ '@/views/system/WelcomeTo.vue'),
        children: []
      },
      {
        path: '/Avatar',
        name: 'Avatar',
        meta: {
          title: 'Avatar'
        },
        component: () => import(/* webpackChunkName: "Avatar" */ '@/views/system/WelcomeTo.vue'),
        children: []
      }
    ]
  }
])
