import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import type { App } from 'vue'

export function setupQiankunApp(setupWebApp: () => Promise<App>) {
  let instance: App | null = null

  renderWithQiankun({
    mount() {
      console.log('mount')
      setupWebApp().then(app => {
        instance = app
      })
    },
    bootstrap() {
      console.log('%c', 'color:green;', ' ChildOne bootstrap')
    },
    update() {
      console.log('%c', 'color:green;', ' ChildOne update')
    },
    unmount() {
      if (!instance) {
        instance = null
        return
      }
      instance?.unmount()
      instance!._container.innerHTML = ''
      instance = null
    }
  })
  if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    console.log('single app')
    setupWebApp()
  }
}
