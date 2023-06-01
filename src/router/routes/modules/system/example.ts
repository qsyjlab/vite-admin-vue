import BasicLayout from '@/layouts/basic-layout/basic-layout.vue'
import { defineExposeRoutes } from '@/router'

export default defineExposeRoutes([
  {
    path: '/card',
    name: 'Card',
    meta: {
      title: 'Card',
      sort: 5
    },
    component: () => import('@/layouts/basic-layout/basic-layout.vue'),
    children: [
      {
        path: '/card-m',
        name: 'CardM',
        meta: {
          title: 'CardM'
        },
        component: () => import('@/views/system/WelcomeTo.vue'),
        children: [
          {
            path: 'card1',
            name: 'Card1',
            meta: {
              title: 'Card1'
            },
            component: () => import('@/views/system/WelcomeTo.vue'),
            children: []
          },
          {
            path: 'Menu12',
            name: 'Menu12',
            meta: {
              title: 'Menu1'
            },
            component: () => import('@/views/system/WelcomeTo.vue'),
            children: []
          },
          {
            path: 'Avatar1',
            name: 'Avatar1',
            meta: {
              title: 'Avatar1'
            },
            component: () => import('@/views/system/WelcomeTo.vue'),
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
        component: () => import('@/views/system/WelcomeTo.vue'),
        children: []
      },
      {
        path: '/Avatar',
        name: 'Avatar',
        meta: {
          title: 'Avatar'
        },
        component: () => import('@/views/system/WelcomeTo.vue'),
        children: []
      }
    ]
  }
])
