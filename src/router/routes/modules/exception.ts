import { Layout } from '@/router/constant'
import { defineRouteModule } from '@/router/helper'

export default defineRouteModule({
  name: 'Exception',
  path: '/exception',
  meta: {
    // <el-icon><WarningFilled /></el-icon>
    title: '异常页面',
    hideChildrenInMenu: false,
    ignoreAuth: true,
    icon: 'ep.warning-filled'
  },
  component: Layout,
  children: [
    {
      name: '404',
      path: '404',
      meta: {
        ignoreAuth: true,
        title: '404'
      },
      component: () => import('@/views/error/error-404.vue')
    },
    {
      name: '403',
      path: '403',
      meta: {
        title: '403',
        ignoreAuth: true
      },
      component: () => import('@/views/error/error-403.vue')
    }
  ]
})
