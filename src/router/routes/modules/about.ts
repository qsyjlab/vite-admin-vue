import { Layout } from '@/router/constant'
import { defineRouteModule } from '@/router/helper'

export default defineRouteModule({
  name: 'About',
  path: '/about',
  meta: {
    icon: 'ep.document',
    ignoreAuth: true,
    title: '关于',

    hideChildrenInMenu: true
  },
  redirect: {
    name: 'AboutIndex'
  },
  component: Layout,
  children: [
    {
      name: 'AboutIndex',
      path: 'about',
      meta: {
        icon: 'ep.document',
        ignoreAuth: true,
        title: '关于',
        order: 20
      },
      component: () => import('@/views/system/about/about.vue')
    }
  ]
})
