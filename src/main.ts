import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from '@/router'
import setupPlugins from '@/plugins'
import setupDirective from '@/directive'
import setupAccess from '@/access'
import setupStore from '@/store'
import { sso } from '@/sso'
import { cleanupLegacyMockWorker } from '@/mocks'
import '@framebase/element-plus-theme/style.css'
import '@/styles/index.scss'
import { startQiankunApp } from '@/micro-app/root-app'

const root = '#app'
async function setupWebApp() {
  await cleanupLegacyMockWorker()
  const app = createApp(App)

  setupPlugins(app)
  setupDirective(app)
  setupStore(app)
  setupAccess(app)
  // sso
  await sso()
  await setupRouter(app)
  app.mount(root)
  startQiankunApp()
  return app
}
setupWebApp()

// setupQiankunApp()
