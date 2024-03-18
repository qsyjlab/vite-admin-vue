import type { App } from 'vue'
import { piniaInstance } from './pinia'

export * from './module'

export default (app: App) => {
  app.use(piniaInstance)
}
