import { createBlankContainer } from '@/layouts'
import { defineExposeRoutes } from '@/router'

export default defineExposeRoutes([
  {
    name: 'OutLink',
    path: '/out-link',
    meta: {
      isNotAuth: true,
      sort: 7,
      title: '外链',
      href: 'https://qsyjlab.club'
    },
    component: createBlankContainer('OutLink')
  }
])
