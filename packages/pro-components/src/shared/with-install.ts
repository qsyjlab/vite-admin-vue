import type { App, Component, Plugin } from 'vue'

export type ComponentWithInstall<T> = T & Plugin

export function withInstall<T, TExtra extends Record<string, Component>>(
  component: T,
  extra?: TExtra
) {
  const installable = component as ComponentWithInstall<T>
  installable.install = (app: App) => {
    const main = component as Component & { name?: string }
    if (main.name) app.component(main.name, main)
    Object.values(extra ?? {}).forEach(item => {
      if (item.name) app.component(item.name, item)
    })
  }
  if (extra) Object.assign(installable, extra)
  return installable as ComponentWithInstall<T> & TExtra
}
