/*
 * @Description: main
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 17:34:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-19 16:17:12
 * @FilePath: \vite-admin-vue\src\main.ts
 */
import { createApp } from 'vue'
import App from './App.vue'

// 挂载路由
import { setupRouter } from './router'
// 挂载插件
import setUpPlugins from './plugins'
// import store, { storeSymbolkey } from './vuex'
import setUpDirective from './directive'

import { createPinia } from 'pinia'

const pinia = createPinia()
async function setupWebApp() {
  // 创建实例
  const app = createApp(App)

  app.use(pinia)
  // 插件
  app.use(setUpPlugins)

  app.use(setUpDirective)
  app.use(setupRouter)
  app.mount('#app')
}

setupWebApp()
