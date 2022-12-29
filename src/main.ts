import { createApp } from 'vue'
import App from './app.vue'

// 挂载路由
import { setupRouter } from './router'
// 挂载插件
import setUpPlugins from './plugins'
import setUpDirective from './directive'

import 'element-plus/theme-chalk/dark/css-vars.css'

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
