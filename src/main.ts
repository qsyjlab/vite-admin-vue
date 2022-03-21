/*
 * @Description: main
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 17:34:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 17:20:15
 * @FilePath: \vite-admin-vue\src\main.ts
 */
import { createApp } from 'vue'
import App from './App.vue'

// 挂载路由
import { setupRouter } from './router'
// 挂载插件
import setUpPlugins from './plugins'
import store, { storeSymbolkey } from './store'
import setUpDirective from './directive'

async function setupWebApp() {
  // 创建实例
  const app = createApp(App)

  // 挂载路由
  await setupRouter(app)

  setUpDirective(app)
  // vuex
  app.use(store, storeSymbolkey)
  // 插件
  app.use(setUpPlugins)
  app.mount('#app')
}

setupWebApp()
