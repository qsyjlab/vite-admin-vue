import type { App } from 'vue'

type DefineAppPlugin = (install: (app: App) => void) => (app: App) => void

/**
 * 类型包装器
 * @param install
 * @returns
 */
export const defineAppPlugin: DefineAppPlugin = install => install
