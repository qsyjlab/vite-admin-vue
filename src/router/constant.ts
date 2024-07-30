import { h } from 'vue'

export const EXCEPTION_COMPONENT = () => import('@/views/error/error-404.vue')
export const Layout = () => import('@/layouts/basic-layout/basic-layout.vue')

export const BlankContainer = () =>
  Promise.resolve({
    name: 'BlankContainer',
    setup() {
      return () => h('div')
    }
  })

export const LOGIN_NAME = 'Login'
export const LOGIN_PATH = '/login'
export const PAGE_NOT_FOUND = 'PageNotFound'

export const REDIRECT_NAME = 'Redirect'

// 路由白名单
export const WHITE_NAME_LIST = [LOGIN_NAME]
