import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import setupPlugins from './plugins'
import setupDirective from './directive'
import setupStore from '@/store'
import { sso } from '@/sso'

const root = '#app'

async function setupWebApp() {
  const app = createApp(App)

  setupPlugins(app)
  setupDirective(app)
  setupStore(app)
  // sso
  await sso()
  await setupRouter(app)
  app.mount(root)
}

setupWebApp()
