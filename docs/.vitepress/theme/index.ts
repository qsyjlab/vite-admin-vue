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
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  async enhanceApp({ app, router, siteData }) {
    // if (inBrowser) {
    //   const components = await import('../.exampleCompnents/index.mjs')
    //   app.use(components['ProTable'])
    //   app.use(components['ProForm'])
    //   app.use(components['ProCheckboxGruop'])
    //   app.use(components['ProSelect'])
    //   app.use(components['ProRadioGruop'])
    //   app.use(components['ProConfigProvider'])
    //   app.use(ElementPlus)
    //   app.component('Demo', Demo)
    // }
    // globals
    // ...
  }
}
