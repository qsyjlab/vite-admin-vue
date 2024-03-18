import type { Plugin } from 'vue'
import { isFunction, isObject } from '../type'

export type SFCWithInstall<T> = T & Plugin

export const withInstall = <T, E extends Record<string, any>>(main: T, extra?: E) => {
  const _main = main as SFCWithInstall<T>
  _main.install = (app): void => {
    for (const comp of [_main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp)
    }
  }

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      ;(_main as any)[key] = comp
    }
  }
  return _main as SFCWithInstall<T> & E
}

// 判定是否是 vue 组件对象
export function isComponent(object: Record<string, any>) {
  if (!isObject(object)) return false

  if (
    (object?.setup && isFunction(object.setup)) ||
    (object?.render && isFunction(object.render))
  ) {
    return true
  }

  return false
}
