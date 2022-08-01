/*
 * @Description: main
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 17:34:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-08-01 09:37:51
 * @FilePath: \vite-admin-vue\src\main.ts
 */
import { createApp } from 'vue'
import App from './App.vue'

// 挂载路由
import { setupRouter } from './router'
// 挂载插件
import setUpPlugins from './plugins'
import setUpDirective from './directive'

async function setupWebApp() {
  // 创建实例
  const app = createApp(App)
  // // 插件
  app.use(setUpPlugins)

  app.use(setUpDirective)
  app.use(setupRouter)
  app.mount('#app')
}

setupWebApp()
