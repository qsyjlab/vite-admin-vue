import { h } from 'vue'

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

export const REDIRECT_NAME = 'Redirect'
