import { defineExposeRoutes } from '@/utils'

export default defineExposeRoutes([
  {
    path: 'icon1',
    name: 'icon1',
    meta: {
      title: 'icon1',
      isNotAuth: true
    },
    component: () => import('@/views/system/WelcomeTo.vue'),
    children: [
      {
        path: 'icon1-1',
        name: 'icon1-1',
        meta: {
          title: 'icon1-1'
        },
        component: () => import('@/views/system/WelcomeTo.vue'),
        children: [
          {
            path: 'icon1-1-1',
            name: 'icon1-1-1',
            meta: {
              title: 'icon1-1-1'
            },
            component: () => import('@/views/system/WelcomeTo.vue'),
            children: []
          },
          {
            path: 'icon1-1-2',
            name: 'icon1-1-2',
            meta: {
              title: 'icon1-1-2'
            },
            component: () => import('@/views/system/WelcomeTo.vue'),
            children: []
          },
          {
            path: 'icon1-1-3',
            name: 'icon1-1-3',
            meta: {
              title: 'icon1-1-3'
            },
            component: () => import('@/views/system/WelcomeTo.vue'),
            children: []
          }
        ]
      },
      {
        path: 'icon1-2-1',
        name: 'icon1-2-1',
        meta: {
          title: 'icon1-2-1'
        },
        component: () => import('@/views/system/WelcomeTo.vue'),
        children: []
      },
      {
        path: 'icon1-2-2',
        name: 'icon1-2-2',
        meta: {
          title: 'icon1-2-2'
        },
        component: () => import('@/views/system/WelcomeTo.vue'),
        children: []
      }
    ]
  },
  {
    path: 'icon1-3',
    name: 'icon1-3',
    meta: {
      title: 'icon1-3',
      isNotAuth: true
    },
    component: () => import('@/views/system/WelcomeTo.vue'),
    children: [
      {
        path: 'icon1-3-1',
        name: 'icon1-3-1',
        meta: {
          isNotAuth: true,
          title: 'icon1-3-1'
        },
        component: () => import('@/views/system/WelcomeTo.vue'),
        children: [
          {
            path: 'icon1-3-1-1',
            name: 'icon1-3-1-1',
            meta: {
              isNotAuth: true,
              title: 'icon1-3-1-1'
            },
            component: () => import('@/views/system/WelcomeTo.vue'),
            children: []
          },
          {
            path: 'icon1-3-1-2',
            name: 'icon1-3-1-2',
            meta: {
              isNotAuth: true,
              title: 'icon1-3-1-2'
            },
            component: () => import('@/views/system/WelcomeTo.vue'),
            children: []
          },
          {
            path: 'menu3',
            name: 'icon2-1-3',
            meta: {
              isNotAuth: true,
              title: 'icon2-1-3'
            },
            component: () => import('@/views/system/WelcomeTo.vue'),
            children: []
          }
        ]
      },
      {
        path: 'icon2-2',
        name: 'icon2-2',
        meta: {
          isNotAuth: true,
          title: 'icon2-2'
        },
        component: () => import('@/views/system/WelcomeTo.vue'),
        children: []
      },
      {
        path: 'icon2-3',
        name: 'icon2-3',
        meta: {
          isNotAuth: true,
          title: 'icon2-3'
        },
        component: () => import('@/views/system/WelcomeTo.vue'),
        children: []
      }
    ]
  }
])
