import { defineRouteModule } from '@/router/helper'

export default defineRouteModule({
  name: 'About',
  path: '/about',
  meta: {
    ignoreAuth: true,
    title: '关于',
    menu: {
      icon: 'ep.document',
      order: 20,
      hideChildrenInMenu: true
    }
  },
  children: [
    {
      name: 'AboutIndex',
      path: 'about',
      meta: {
        ignoreAuth: true,
        title: '关于'
      },
      component: () => import('@/views/system/about/about.vue')
    }
  ]
})
