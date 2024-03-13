import { BlankContainer } from '@/router/constant'
import { defineRouteModule } from '@/router/helper'

export default defineRouteModule({
  name: 'Docs',
  path: '/docs',
  meta: {
    icon: 'ep.document',
    ignoreAuth: true,
    title: '文档',
    href: 'https://qsyjlab.github.io/vite-admin-vue/'
  },
  component: BlankContainer
})
