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
        path: '/card-m',
        name: 'CardM',
        meta: {
          title: 'CardM'
        },
        component: () => import('@/views/system/WelcomeTo.vue'),
        children: [
          {
            path: '/card1',
            name: 'Card1',
            meta: {
              title: 'Card1'
            },
            component: () => import('@/views/system/WelcomeTo.vue'),
            children: []
          },
          {
            path: '/Menu1',
            name: 'Menu1',
            meta: {
              title: 'Menu1'
            },
            component: () => import('@/views/system/WelcomeTo.vue'),
            children: []
          },
          {
            path: '/Avatar1',
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
  },
  {
    path: 'icon2',
    name: 'icon2',
    meta: {
      title: 'icon2',
      isNotAuth: true
    },
    component: () => import('@/views/system/WelcomeTo.vue'),
    children: [
      {
        path: 'icon2-1',
        name: 'icon2-1',
        meta: {
          isNotAuth: true,
          title: 'icon2-1'
        },
        component: () => import('@/views/system/WelcomeTo.vue'),
        children: [
          {
            path: 'icon2-1-1',
            name: 'icon2-1-1',
            meta: {
              isNotAuth: true,
              title: 'icon2-1-1'
            },
            component: () => import('@/views/system/WelcomeTo.vue'),
            children: []
          },
          {
            path: 'icon2-1-2',
            name: 'icon2-1-2',
            meta: {
              isNotAuth: true,
              title: 'icon2-1-2'
            },
            component: () => import('@/views/system/WelcomeTo.vue'),
            children: []
          },
          {
            path: 'icon2-1-3',
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
