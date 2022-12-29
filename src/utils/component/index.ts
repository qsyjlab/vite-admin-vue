import type { Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

export const withInstall = <T, E extends Record<string, any>>(main: T, extra?: E) => {
  const _main = main as SFCWithInstall<T>
  _main.install = (app): void => {
    for (const comp of [_main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp)

      // console.log('comp.name, comp');
    }
  }

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      ;(_main as any)[key] = comp
    }
  }
  return _main as SFCWithInstall<T> & E
}
