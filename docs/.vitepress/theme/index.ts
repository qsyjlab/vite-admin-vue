// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import './style.css'

import ElementPlus from 'element-plus'
import Demo from '../components/demos/vp-demo.vue'

import 'element-plus/theme-chalk/index.css'

import '../.exampleCompnents/style.css'

import 'prismjs/themes/prism.css'

export default {
  extends: Theme,
  Layout: () => {
    return h(
      'div',
      { proTable: {} },
      h(Theme.Layout, null, {
        // https://vitepress.dev/guide/extending-default-theme#layout-slots
      })
    )
  },
  async enhanceApp({ app, router, siteData }) {
    if (!import.meta.env.SSR) {
      app.component('Demo', Demo)
      app.use(ElementPlus)
      const plugin = await import('../.exampleCompnents/index.mjs')

      app.use(plugin['ProTable'])
      app.use(plugin['ProForm'])
      app.use(plugin['ProSelect'])
      app.use(plugin['ProRadioGroup'])
      app.use(plugin['ProCheckboxGroup'])
    }
  }
}
