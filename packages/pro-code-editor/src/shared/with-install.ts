import type { App, Component, Plugin } from 'vue'

export type ComponentWithInstall<T> = T & Plugin

export function withInstall<T>(component: T) {
  const installable = component as ComponentWithInstall<T>
  installable.install = (app: App) => {
    const main = component as Component & { name?: string }
    if (main.name) app.component(main.name, main)
  }
  return installable
}
