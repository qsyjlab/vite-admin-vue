import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import setupPlugins from './plugins'
import setupDirective from './directive'
import setupStore from '@/store'

const root = '#app'

async function setupWebApp() {
  const app = createApp(App)

  app.use(setupPlugins)
  app.use(setupDirective)
  app.use(setupStore)
  app.use(setupRouter)
  app.mount(root)
}

setupWebApp()
