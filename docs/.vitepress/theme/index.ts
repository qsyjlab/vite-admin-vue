// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import './style.css'

import ElementPlus from 'element-plus'
import Demo from '../components/demos/vp-demo.vue'

import 'element-plus/theme-chalk/index.css'

import { ProTable, ProConfigProvider } from '../.exampleCompnents/index.mjs'
import '../.exampleCompnents/style.css'

import 'prismjs/themes/prism.css';

export default {
  extends: Theme,
  Layout: () => {
    return h(ProConfigProvider, null, {
      default: ()=> h(Theme.Layout, null, {
        // https://vitepress.dev/guide/extending-default-theme#layout-slots
      })
    })
  },
  enhanceApp({ app, router, siteData }) {

    app.use(ElementPlus)

    app.use(ProTable)


    app.component('Demo', Demo)
    // globals
    // ...
  }
}
