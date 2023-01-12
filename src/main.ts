import { createApp } from 'vue'
import App from './app.vue'
import { setupRouter } from './router'
import setUpPlugins from './plugins'
import setUpDirective from './directive'

const root = '#app'

async function setupWebApp() {
  const app = createApp(App)

  app.use(setUpPlugins)

  app.use(setUpDirective)
  app.use(setupRouter)
  app.mount(root)
}

setupWebApp()
