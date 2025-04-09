import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import setupPlugins from './plugins'
import setupDirective from './directive'
import setupAccess from './access'
import setupStore from '@/store'
import { sso } from '@/sso'
import '@/styles/index.scss'

const root = '#app'

async function setupWebApp() {
  const app = createApp(App)

  setupPlugins(app)
  setupDirective(app)
  setupStore(app)
  setupAccess(app)
  // sso
  await sso()
  await setupRouter(app)
  app.mount(root)
}

setupWebApp()
